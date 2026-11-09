---
title: "Linux Terminal Essentials Every Developer Needs"
description: "The handful of terminal commands and shortcuts I use every day for navigating, searching, piping output, and managing jobs on Linux."
pubDate: 2025-03-12
category: Linux
tags: [linux, terminal, bash, cli]
draft: false
featured: false
---

You can do a lot of development work without ever leaving the terminal, but only if a small core of commands is second nature. This is the set I reach for daily. None of it is exotic, and all of it works in a stock bash installation, so you can rely on it on a fresh server, in a container, or on a colleague's laptop.

## Navigating the filesystem

Start with knowing where you are and what is around you.

```bash
pwd          # print the current directory
ls -la       # long listing, including hidden files
cd -         # jump back to the previous directory
cd           # with no argument, go home
```

`cd -` is the one people tend to miss. It toggles between two directories, which is handy when you are bouncing between a source tree and a log folder.

When you need more than two places, use a directory stack:

```bash
pushd ~/projects/api    # go there, remember where you were
pushd /var/log          # stack another one
dirs -v                 # show the stack with indexes
popd                    # return to the previous entry
```

## Finding things

`find` locates files by name, type, size, or age. `grep` searches inside them.

```bash
find . -name "*.ts" -not -path "./node_modules/*"
find . -type f -mtime -1          # files changed in the last day
grep -rn "TODO" src/              # recursive, with line numbers
grep -rni --include="*.md" "systemd" .
```

If you search code often, install ripgrep (`rg`). It respects `.gitignore`, skips binary files, and is much faster on large repositories. The equivalent of the first grep above is simply `rg -n TODO src/`.

## Pipes and redirection

Every program has standard output (1) and standard error (2). Pipes and redirects let you connect them.

```bash
ps aux | grep node | wc -l        # chain commands with |
ls -la > listing.txt              # overwrite a file
echo "done" >> build.log          # append to a file
make > build.log 2>&1             # send both streams to one file
make 2>&1 | tee build.log         # watch the output and save it
```

The order in `2>&1` matters: it means "send stderr to wherever stdout points right now", so it must come after the `>` redirect. `tee` is the right tool when you want to see output live and keep a copy.

## Viewing files

Avoid dumping large files with `cat`. Use a pager or look at the edges.

```bash
less +F app.log      # follow mode; Ctrl-C to stop following, q to quit
head -n 20 data.csv  # first 20 lines
tail -n 50 app.log   # last 50 lines
tail -f app.log      # stream new lines as they arrive
```

Inside `less`, `/pattern` searches forward, `n` jumps to the next match, and `G` goes to the end.

## Job control

A long-running command does not have to block your shell.

- `Ctrl-C` stops the foreground process.
- `Ctrl-Z` suspends it and returns your prompt.
- `bg` resumes the suspended job in the background.
- `fg` brings it back to the foreground.
- `jobs` lists what the current shell is managing.

```bash
npm run build         # takes a while... press Ctrl-Z
bg                    # let it continue in the background
jobs                  # [1]+ Running  npm run build &
fg %1                 # bring job 1 back
```

For work that must survive closing the terminal, look at `tmux` or a proper service; I cover the latter in [systemd basics](/blog/systemd-basics/).

## Searching your history

Press `Ctrl-R` and start typing. Bash searches backwards through history for a matching command; press `Ctrl-R` again to cycle to older matches, `Enter` to run, or the right arrow to edit first. Combined with `history | grep docker`, you rarely need to retype anything long.

## Habits worth building

- Tab-complete everything. It prevents typos and teaches you what exists.
- Use `man` and `--help` before searching the web; `tldr` pages are a nice shortcut for examples.
- Quote paths and patterns that contain spaces or wildcards.
- Preview destructive commands first, for example run the `find` command on its own before adding `-delete`.
- Turn repeated command lines into aliases once they annoy you. I wrote about that in [shell aliases and functions](/blog/shell-aliases-and-functions/).

## What to do next

Pick two items from this list that you do not use yet, such as `cd -` and `Ctrl-R`, and force yourself to use them for a week. Once they are automatic, add the next pair. Small, deliberate repetition beats reading another cheat sheet.
