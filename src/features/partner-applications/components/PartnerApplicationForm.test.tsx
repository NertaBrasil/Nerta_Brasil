import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const submitPartnerApplicationMock = vi.fn();
vi.mock("../actions", () => ({ submitPartnerApplication: submitPartnerApplicationMock }));

const { PartnerApplicationForm } = await import("./PartnerApplicationForm");

async function fillIdentificationStep(documentNumber = "11222333000181") {
  await userEvent.type(screen.getByLabelText(/razão social/i), "Transportes Exemplo Ltda");
  await userEvent.type(screen.getByLabelText(/cnpj|cpf/i), documentNumber);
  await userEvent.type(screen.getByLabelText(/cidade/i), "São Paulo");
  await userEvent.type(screen.getByLabelText(/^estado/i), "SP");
  await userEvent.type(screen.getByLabelText(/nome do responsável/i), "Maria Silva");
  await userEvent.type(screen.getByLabelText(/cargo/i), "Gerente de Compras");
  await userEvent.type(screen.getByLabelText(/telefone/i), "+55 11 99999-0000");
  await userEvent.type(screen.getByLabelText(/^e-mail$/i), "maria@exemplo.com.br");
}

async function advanceThroughRemainingSteps() {
  for (let step = 0; step < 5; step += 1) {
    await userEvent.click(screen.getByRole("button", { name: /avançar/i }));
  }
}

describe("PartnerApplicationForm", () => {
  beforeEach(() => {
    submitPartnerApplicationMock.mockReset();
  });

  it("exibe campos de Pessoa Jurídica por padrão (Razão Social/Nome Fantasia)", () => {
    render(<PartnerApplicationForm productId="prod-1" productName="Truck Clean" />);

    expect(screen.getByLabelText(/razão social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome fantasia/i)).toBeInTheDocument();
  });

  it("ao escolher Pessoa Física, substitui Razão Social/Nome Fantasia por Nome Completo", async () => {
    render(<PartnerApplicationForm productId="prod-1" productName="Truck Clean" />);

    await userEvent.click(screen.getByRole("button", { name: /pessoa física/i }));

    expect(screen.queryByLabelText(/razão social/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/nome fantasia/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
  });

  it("bloqueia o avanço quando o documento informado é inválido", async () => {
    render(<PartnerApplicationForm productId="prod-1" productName="Truck Clean" />);

    await fillIdentificationStep("11222333000100");
    await userEvent.click(screen.getByRole("button", { name: /avançar/i }));

    expect(
      await screen.findByText(/documento inválido/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/razão social/i)).toBeInTheDocument();
  });

  it("envia o formulário completo e exibe confirmação ao concluir todas as etapas", async () => {
    submitPartnerApplicationMock.mockResolvedValue({ success: true, data: undefined });

    render(<PartnerApplicationForm productId="prod-1" productName="Truck Clean" />);

    await fillIdentificationStep();
    await advanceThroughRemainingSteps();

    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(submitPartnerApplicationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: "prod-1",
        document_type: "cnpj",
        document_number: "11222333000181",
        legal_name: "Transportes Exemplo Ltda",
      })
    );
    expect(await screen.findByText(/candidatura enviada/i)).toBeInTheDocument();
  });
});
