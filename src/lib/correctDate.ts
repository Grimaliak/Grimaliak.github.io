export function correctDate (dateString: string) {
    const date = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  
    if (hoursDifference < 24) {
      if (hoursDifference < 1) {
        return 'сделано менее часа назад';
      } else {
        const hours = hoursDifference === 1 ? 'час' : hoursDifference < 5 ? `${hoursDifference} часа` : `${hoursDifference} часов`;
        return `${hours} назад`;
      }
    } else {
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  };