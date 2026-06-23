# dotpath: small, boring PATH helpers.
# shellcheck shell=bash
# Keep this public-safe: no machine-specific private directories.

_dotpath_prepend_path() {
  case ":$PATH:" in
    *":$1:"*) ;;
    *) PATH="$1:$PATH" ;;
  esac
}

_dotpath_prepend_path "$HOME/.local/bin"
_dotpath_prepend_path "$HOME/bin"
export PATH
