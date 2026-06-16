Campos de formulário escuros para a área /admin (Supabase Auth). Fundo navy-sunken, foco azul.

```jsx
<Input label="E-mail" type="email" placeholder="admin@nerta.com.br" />
<Input label="Senha" type="password" error="Credenciais inválidas" />
<Select label="Linha" placeholder="Selecione" options={["Frotas","Agro","Detailing"]} />
```

`Input`: `label`, `hint`, `error`, `leftIcon`. `Select`: `options` (string ou {value,label}), `placeholder`.
