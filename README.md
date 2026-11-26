# Quiz Geladeira Pronta

Reprodução React do HTML fornecido em `qa/reference.html`. Os estilos e as fontes em `src/source.css` foram extraídos diretamente desse arquivo. A página original não contém rodapé; o fluxo tem sete etapas, carregamento e tela de vídeo.

## Abrir por duplo clique

Abra `index.html` na raiz do projeto. Ele contém o React e o CSS embutidos e funciona diretamente como `file://`. Após alterações no código, execute `pnpm.cmd build` para atualizá-lo.

## Desenvolvimento

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Abra `http://localhost:5173/src/dev.html`. Para gerar a versão de produção e atualizar o arquivo de abertura direta, execute `pnpm.cmd build`.

## Conferência visual

Com o servidor local ativo:

```powershell
node qa/compare.mjs
node qa/verify.mjs
```

`compare.mjs` compara as capturas estáticas do HTML original e do `index.html` aberto como `file://` em 390 px e 1280 px. `verify.mjs` percorre as sete etapas e o atraso de 30 segundos da tela de vídeo. `verify-video.mjs` confere que o iframe carregado durante o progresso permanece montado e inicia a reprodução ao aparecer. Os scripts usam o Chrome instalado em `C:/Program Files/Google/Chrome/Application/chrome.exe`.

A tela de progresso aguarda no mínimo 3,2 segundos e a carga inicial do iframe, com limite de 9 segundos. O vídeo começa automaticamente sem som, de acordo com as regras dos navegadores; a pessoa ativa o áudio no próprio player.
