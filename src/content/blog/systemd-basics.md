---
title: "systemd Basics: Services, Units, and Timers"
description: "A practical introduction to systemd: manage services with systemctl, write a unit file, read journal logs, and replace cron with a timer."
pubDate: 2025-08-19
category: Linux
tags: [linux, systemd, services, bash]
draft: false
featured: false
---

On most modern Linux distributions, systemd is the first process the kernel starts, PID 1. It brings up the system, supervises services, collects their logs, and schedules recurring jobs. You do not need to master all of it, but a working knowledge pays off the first time you deploy something that must stay running.

## Units in one minute

systemd manages resources described by unit files. The type is the file extension:

- `.service` runs a daemon or a one-shot command.
- `.timer` triggers another unit on a schedule.
- `.socket`, `.mount`, and `.target` cover sockets, filesystems, and groups of units.

Your own system-wide units belong in `/etc/systemd/system/`, while packages install theirs under `/usr/lib/systemd/system/`.

## systemctl essentials

```bash
systemctl status nginx          # state, recent logs, main PID
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx     # start at boot
sudo systemctl enable --now nginx   # enable and start in one go
sudo systemctl disable nginx
sudo systemctl daemon-reload    # re-read unit files after editing
```

Remember the difference: `start` affects now, `enable` affects boot. After editing any unit file, run `daemon-reload` or systemd keeps using the old version.

The `status` output is worth reading closely. It shows whether the unit is active, when it started, its main PID, and the last few log lines, which is often enough to diagnose a failure without opening anything else.

For services that belong to your user rather than the system, add `--user`. Units go in `~/.config/systemd/user/`, and no `sudo` is needed:

```bash
systemctl --user status notes-backup.service
```

## Writing a small service

Say I have a script that backs up my notes directory. It runs, finishes, and exits, so a one-shot service is enough. The `[Unit]` section describes the service and its ordering, and `[Service]` says what to execute and as whom:

```ini title="/etc/systemd/system/notes-backup.service"
[Unit]
Description=Back up notes to the archive disk
After=network-online.target

[Service]
Type=oneshot
User=perdi
ExecStart=/usr/local/bin/notes-backup.sh
```

For a long-running process, you will want it to come back after a crash. Here is the edit:

```diff
 [Service]
 ExecStart=/usr/local/bin/notes-server
+Restart=on-failure
+RestartSec=5
```

`on-failure` restarts the process only after a non-zero exit or a crash, not when you stop it deliberately, and `RestartSec` avoids a tight restart loop. Save, run `sudo systemctl daemon-reload`, then restart the service. Make sure the script is executable; the permissions article on [Linux file permissions](/blog/linux-file-permissions/) explains why that matters.

## Reading logs with journalctl

systemd captures stdout and stderr from services into the journal, so you rarely need a custom log file or a log rotation setup. Every line is stored with a timestamp and the unit that produced it, which makes filtering simple.

```bash
journalctl -u notes-backup.service            # everything for the unit
journalctl -u notes-backup.service -f         # follow live
journalctl -u notes-backup.service --since "1 hour ago"
journalctl -u nginx --since today -p err      # only errors
journalctl -b                                 # current boot
```

## Replacing cron with a timer

A timer is a second unit that activates the service with the same base name. Create it next to the service:

```ini title="/etc/systemd/system/notes-backup.timer"
[Unit]
Description=Run notes backup daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

`Persistent=true` is the feature I miss most in cron: if the machine was off at the scheduled time, the job runs at the next boot. Enable the timer, not the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now notes-backup.timer
systemctl list-timers --all             # next and last run times
systemd-analyze calendar "Mon *-*-* 03:00"   # validate a schedule
```

Compared with cron, you gain logging through the journal, dependency ordering, and a clear status view. The cost is two files instead of one line. The pairing works by name: `notes-backup.timer` starts `notes-backup.service` automatically, so you never enable the service itself.

## What to do next

Pick one cron job or `nohup` command you currently rely on and convert it to a unit. Start with `--user` units so mistakes stay in your home directory, and check the result with `systemctl status` and `journalctl -u`. Once that works, add `Restart=` and resource limits as needed.
