const newAnswers = new Set(JSON.parse(localStorage.getItem('newAnswers') || '[]'));

export function addNewAnswerNotification(questionUuid) {
  newAnswers.add(questionUuid);
  localStorage.setItem('newAnswers', JSON.stringify(Array.from(newAnswers)));
}

export function removeAnswerNotification(questionUuid) {
  newAnswers.delete(questionUuid);
  localStorage.setItem('newAnswers', JSON.stringify(Array.from(newAnswers)));
}

export function getNotificationCount() {
  return newAnswers.size;
}