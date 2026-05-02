# dotpath: safety rails that do not assume private tooling.

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

confirm() {
  printf '%s [y/N] ' "${1:-Continue?}"
  read -r answer
  case "$answer" in
    y|Y|yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}
