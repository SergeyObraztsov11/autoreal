import { getLocation, type Location, yandexReviewsUrl } from './site'

export type Review = {
  id: string
  /** Author display name */
  author: string
  /** 1–5 */
  rating: number
  /** ISO date YYYY-MM-DD */
  date: string
  text: string
  locationId: Location['id']
  /** Deep-link to the review (or org reviews tab) on Yandex */
  url?: string
}

const serviceReviewsUrl = yandexReviewsUrl(getLocation('service'))

/** Real Yandex Maps reviews (service org) — curated from screenshots */
export const reviews: Review[] = [
  {
    id: 'anna-manytskaya',
    author: 'Анна Маныцкая',
    rating: 5,
    date: '2026-03-15',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'ТО, шиномонтаж, диагностика, заказ запчастей, ремонт, все под ключ - все быстро, четко, без лишней воды, а цены самые лучшие. Мастера самые лучшие 🫶',
  },
  {
    id: 'pavel',
    author: 'Павел',
    rating: 5,
    date: '2026-03-02',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Отличное СТО, ремонтирую авто и обслуживаю у них уже лет 5. Паша там начальник, грамотный хорошо разбирается в авто. Всегда все работы проделывают качественно и Паша старается и переживает за качество. Так что рекомендую данное СТО, уже и знакомым советовал, тоже им там понравилось.',
  },
  {
    id: 'vladimir-bulatov',
    author: 'Владимир Булатов',
    rating: 5,
    date: '2025-09-03',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Отличный сервис. Отзывчивый персонал. Мастера своего дела. Мне всё понравилось. Сделали всё быстро и качественно.',
  },
  {
    id: 'ekaterina-d',
    author: 'Екатерина Д.',
    rating: 5,
    date: '2025-09-02',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Отличный сервис, где с пониманием относятся к девушкам, которые плохо разбираются в авто. Помогают, отвечают на все вопросы, быстро и качественно работают',
  },
  {
    id: 'sergey-z',
    author: 'Сергей З.',
    rating: 5,
    date: '2023-08-12',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Менял масло в Акпп, замену тормозной, масла привозил с собой, заменили очень оперативно и качественно. Мастер Андрей сделал все отлично.',
  },
  {
    id: 'sergey-m',
    author: 'Сергей М',
    rating: 5,
    date: '2023-07-24',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Профессионалы. Помогли подобрать сигнализацию и установили на авто. Установщик Сергей все качественно сдел, все что хотел от сигнализации было реализовано. Вобщем, очень рекомендую.',
  },
  {
    id: 'elizaveta-zhdanova',
    author: 'Елизавета Жданова',
    rating: 5,
    date: '2023-06-12',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Обслуживаюсь здесь с тех пор как купила машину. Очень удобный сервис, записываешься и приезжаешь. Вежливые и терпеливые ребята. Я задаю много вопросов 😛 делают быстро и на отлично, очень приятные цены',
  },
  {
    id: 'aleksandr-zadorozhniy',
    author: 'Александр Задорожний',
    rating: 5,
    date: '2021-03-04',
    locationId: 'service',
    url: serviceReviewsUrl,
    text: 'Ребята знают своё дело',
  },
  {
    id: 'vyacheslav-tremilya',
    author: 'Вячеслав Тремиля',
    rating: 5,
    date: '2019-08-01',
    locationId: 'service',
    url: serviceReviewsUrl,
    text:
      'Заметно более профессиональный подход к ремонту машин и установке дополнительной электроники. Ставил Пандору с автозапуском на Туарега. Пару раз менял масло в коробке методом вытеснения. Масла и фильтра постоянно меняю у них. Живу в Ростове-на-Дону. Один раз поменял диски с колодками рядом с домом и очень пожалел, когда столкнулся с вибрациями при торможении и скрипом колодок. Пришлось ехать в Волгодонск и менять ещё раз. Как говорится: «скупой платит дважды» )) Особо хочу отметить профессионализм Голышева Павла: лучше прислушиваться к его мнению и не повторять моих ошибок. Да, и масла у них от официалов. Твёрдо рекомендую обслуживать свои автомобили там, хоть и часто у них бывает очередь. Сервис лучше чем у официальных дилеров, а цены заметно ниже.',
  },
]

export function reviewLocationLabel(review: Review) {
  return getLocation(review.locationId).label
}

export function formatReviewDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function reviewInitials(author: string) {
  const parts = author.replace(/\./g, '').trim().split(/\s+/)
  const letters = parts
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('')
  return letters || '?'
}
