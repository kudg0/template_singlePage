//Функция отправки событий в GA
function gaPushEvent(action, category, label, nonInteraction) {
  try {
    if (!window.location.href.includes('localhost') && window['gtag']) {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        non_interaction: nonInteraction,
      });
    } else {
      console.log(action, category, label, nonInteraction);
    }
  } catch (e) {
    console.log(e);
  }
}
//**OVER**
