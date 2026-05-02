export const manifest = [
  { source: 'examples/.zshrc.d/00-path.zsh', target: '.zshrc.d/00-path.zsh', kind: 'zsh' },
  { source: 'examples/.zshrc.d/10-agentic.zsh', target: '.zshrc.d/10-agentic.zsh', kind: 'zsh' },
  { source: 'examples/.zshrc.d/20-safety.zsh', target: '.zshrc.d/20-safety.zsh', kind: 'zsh' },
  { source: 'examples/git/gitconfig.aliases', target: '.config/git/aliases.dotpath', kind: 'git' },
  { source: 'examples/editor/editorconfig', target: '.editorconfig', kind: 'editor' },
  { source: 'examples/env/dotpath.env.example', target: '.config/dotpath/env.example', kind: 'env' }
];
