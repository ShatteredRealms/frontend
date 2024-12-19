
const timeSince = (date: Date, concise: boolean = false, justNow: boolean = true): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return timeStringFromSeconds(Math.floor(diff / 1000), concise, justNow);
};

const timeStringFromSeconds = (seconds: number, concise: boolean = false, justNow: boolean = true): string => {
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  seconds = Math.floor(seconds % 60);
  minutes = minutes % 60;
  hours = hours % 24;

  if (concise) {
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else if (seconds > 10 || !justNow) {
      return `${seconds}s`;
    } else {
      return 'just now';
    }
  }

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minute${minutes > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${seconds % 60} second${seconds > 1 || seconds == 0 ? 's' : ''}`;
  } else if (seconds > 10 || !justNow) {
    return `${seconds} second${seconds > 1 || seconds == 0 ? 's' : ''}`;
  } else {
    return 'just now';
  }
}

const timeAgo = (date: Date, concise: boolean = false): string => {
  return timeSince(date, concise) + ' ago';
};

const timeAge = (date: Date, concise: boolean = false): string => {
  return timeSince(date, concise, false) + ' old';
}

export { timeStringFromSeconds, timeSince, timeAgo, timeAge };
