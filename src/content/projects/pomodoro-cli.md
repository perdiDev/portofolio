---
title: Pomodoro CLI
summary: A Bash script that runs Pomodoro work and break cycles and sends each step as a desktop notification on Linux.
date: 2025-11-28
order: 8
featured: false
status: Live
role: Developer
duration: 1 day
techStack: [Bash, libnotify, Linux]
repoUrl: https://codeberg.org/perdidev/pomodoro-daemon
thumbnail:
  image: ../../assets/projects/pomodoro-cli/screenshot-1.png
  alt: Terminal window showing the first part of pomodoro-daemon.sh with the default timer values and the option parsing loop
screenshots:
  - image: ../../assets/projects/pomodoro-cli/screenshot-1.png
    alt: Terminal window showing the first part of pomodoro-daemon.sh with the default timer values, the getopts loop and the first notify-send call
    caption: Defaults are 25 minutes of work, 5 minutes of break and 4 rounds. Flags override each one.
  - image: ../../assets/projects/pomodoro-cli/screenshot-2.png
    alt: Terminal window showing the loop in pomodoro-daemon.sh that sleeps for the work time, counts down the last five seconds and sends break notifications
    caption: Each round sleeps for the work time, counts down the last five seconds, then announces the break.
  - image: ../../assets/projects/pomodoro-cli/screenshot-3.png
    alt: Six dark desktop notifications in order, from the start summary to the final message that says it is time to hibernate
    caption: The notification sequence for one session, rendered from the exact messages in the script.
challenges:
  - challenge: A new notification for every step would pile up on the desktop and bury the timer.
    solution: Every call uses the same x-canonical-private-synchronous hint, so the notification daemon replaces the previous bubble instead of stacking a new one.
  - challenge: Waiting for a long timer gives no feedback that the script is still running.
    solution: The last five seconds of each work round update one notification with a progress value, and each finished round updates a progress bar for the whole session.
learned:
  - notify-send hints, such as a synchronous key and an int value, are enough to build a progress bar without any GUI toolkit.
  - getopts needs a colon after a flag letter for that flag to take a value, so the -r option in this version still has a bug to fix.
  - A script that only sleeps and notifies is simple to run in the background, but it has no pause or stop control yet.
outcome: A small script I use for my own work sessions. Next steps are fixing the -r option, a missing line continuation in the final notification, and turning it into a real background service.
relatedPosts: []
---

**Pomodoro CLI** (the repository is called `pomodoro-daemon`) is a single Bash script that runs the Pomodoro technique from the terminal. It sends a desktop notification when a session starts, when a work round ends, when a break starts and when it is over.

### Usage

Run it with no arguments for 4 rounds of 25 minutes of work and 5 minutes of break. Use `-w` for work seconds, `-b` for break seconds and `-r` for the number of rounds.

### Status

It works for daily use on Linux with a notification daemon that supports `notify-send` hints. It is a small script today, and I plan to grow it into a proper daemon.
