Diálogo centralizado sobre scrim escuro. Confirmações (excluir) e formulários curtos.

```jsx
<Modal open={confirm} title="Excluir produto?" destructive
       confirmLabel="Excluir" onClose={() => setConfirm(false)} onConfirm={doDelete}>
  Esta ação não pode ser desfeita. O produto sai do catálogo imediatamente.
</Modal>
```

`destructive` usa o botão vermelho. `hideFooter` para renderizar um corpo customizado (ex: form). Clique no scrim fecha.
