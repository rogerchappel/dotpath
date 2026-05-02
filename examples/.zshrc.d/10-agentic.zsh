# dotpath: agentic development conveniences.
# These are intentionally generic; customize in private files if needed.

alias gs='git status --short --branch'
alias gd='git diff --stat'
alias gds='git diff --staged --stat'
alias ll='ls -lah'

mkcd() {
  mkdir -p "$1" && cd "$1"
}

# Prefer explicit agent workspaces over editing main checkouts directly.
export DOTPATH_WORKTREE_HINT='Use a throwaway worktree for risky edits.'
