---
title: "Shell Aliases and Functions That Save Time"
description: "Practical bash aliases and functions I use daily, from git shortcuts to mkcd and extract, and how to keep them tidy, safe, and portable."
pubDate: 2025-11-18
category: Tips & Tricks
tags: [bash, cli, productivity, terminal]
draft: false
featured: false
project: dev-notes-cli
---

If you type the same long command more than a few times a day, the shell can do the typing for you. Aliases and functions are the two tools for this, and picking the right one avoids a lot of confusion. Here is what I have settled on after years of tweaking.

## Alias or function?

An alias is plain text substitution at the start of a command line. It is perfect for shortening a command with fixed options. The limitation is that arguments are only appended at the end, so an alias cannot place them in the middle or run several steps with logic.

A function is a small shell script living in your session. It takes positional arguments (`$1`, `$2`, `"$@"`), can use conditionals, and can run multiple commands. My rule: start with an alias, and switch to a function the moment you need an argument anywhere but the end.

## Aliases worth having

```bash title="~/.bash_aliases"
# git
alias gs='git status -sb'
alias gl='git log --oneline --graph --decorate -20'
alias gd='git diff'

# safer file operations
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# navigation and listing
alias ll='ls -lAh'
alias ..='cd ..'
```

On the `rm -i` line: it prompts before every deletion, which saves you once and annoys you often. Many people prefer a trash tool such as `trash-put` from the `trash-cli` package, which moves files to the desktop trash so they can be restored. Whichever you choose, make it a deliberate habit rather than relying on luck.

## Functions for the rest

```bash title="~/.bash_aliases"
mkcd() {
  mkdir -p -- "$1" && cd -- "$1"
}

extract() {
  case "$1" in
    *.tar.gz|*.tgz) tar xzf "$1" ;;
    *.tar.bz2)      tar xjf "$1" ;;
    *.tar.xz)       tar xJf "$1" ;;
    *.zip)          unzip "$1" ;;
    *.gz)           gunzip "$1" ;;
    *) echo "extract: unknown format: $1" >&2; return 1 ;;
  esac
}

alias ports='ss -tulpn'

note() {
  local dir="$HOME/notes"
  mkdir -p "$dir"
  echo "$(date +%H:%M) $*" >> "$dir/$(date +%F).md"
}
```

`mkcd` creates a directory and enters it, which no alias can do cleanly. `extract` saves you from remembering `tar` flags. `ports` lists listening TCP and UDP sockets with their processes (run it with `sudo` to see processes you do not own). `note` appends a timestamped line to a file named after today's date, so `note fix flaky test in CI` is a one-second capture. My notes CLI grew out of exactly this function.

## Where to put them

Bash reads `~/.bashrc` for interactive shells. Many distributions already source `~/.bash_aliases` from it, which keeps your additions separate. If yours does not, add one line:

```diff
 # ~/.bashrc
 export EDITOR=vim
+[ -f ~/.bash_aliases ] && . ~/.bash_aliases
```

Then reload with `source ~/.bashrc`. For zsh, the same code goes in `~/.zshrc` (or a sourced file); the aliases and the functions above work unchanged.

## Inspecting what you have

```bash
alias            # list all aliases
alias gs         # show one
type gs          # gs is aliased to `git status -sb'
type mkcd        # shows the function body
unalias gs       # remove for this session
command rm file  # bypass the alias once (or use \rm)
```

`type` is the most useful of these because it tells you whether a name is an alias, a function, a builtin, or a file on disk.

## Keeping them tidy and portable

- Keep one file under version control, such as a dotfiles repository, and symlink it.
- Prefer descriptive function names over two-letter cryptic ones unless you type them constantly.
- Avoid shadowing common commands with different behavior; scripts you run interactively may surprise you.
- Guard anything non-portable, for example `command -v trash-put >/dev/null && alias rm='trash-put'`.
- Remove what you have not used in months.

If you are still building up your command-line basics, [Linux terminal essentials](/blog/linux-terminal-essentials/) is a good companion.

## What to do next

Run `history | awk '{print $2}' | sort | uniq -c | sort -rn | head` to see your most-used commands, then turn the top three into aliases today. Add a function only when an alias stops being enough.
