/* EN layer: ru->en dictionary applied to text nodes and attributes. Works with the existing RU/EN button (html[lang]). */
(function(){
var R=document.documentElement,S=[ /* exact / prefix: whole node is replaced */
['К содержимому','Skip to content'],['Для работы сайта нужен JavaScript','JavaScript is required for this site'],
['Игры','Games'],['Опрос','Poll'],['Гайд для новичков','Beginner guide'],['Гайд','Guide'],['Матчи','Matches'],['Скрим','Scrim'],['Софт','Software'],['Стрим','Stream'],
['HVH-команда · Neverlose','HVH team · Neverlose'],['HVH-команда, которая живёт на резолверах','An HVH team that lives on resolvers and never leaves the fight. Stability, discipline and playing for the result.'],
['Набор открыт: ищем игроков в состав.','Recruitment is open: we are looking for players.'],['Подать заявку','Apply'],
['— HVH-команда из игроков','— an HVH team of players who value a clean resolver, stable anti-aim and teamwork.'],['Наши цели просты','Our goals are simple: keep a high level of play, review demos, fine-tune settings and win every match.'],
['Если ты устал от рандомов','If you are tired of randoms and want to play with people who know what they are doing, join us.'],
['Не просто тег перед ником','Not just a tag before a nickname: a real team with a real approach.'],['Люди, которые держат','The people who keep 764 CL4N going.'],
['Хочешь попасть в состав?','Want to join the roster? Apply in Discord, channel'],['Вступили недавно','Recently joined'],['Новые участники за последние 30 дней.','New members in the last 30 days.'],
['Клипы, хайлайты','Clips, highlights and recordings from our games.'],['Больше контента — в Discord','More content in Discord, channel'],['Моменты, которыми мы гордимся.','Moments we are proud of.'],
['Доска почёта','Hall of fame'],['Легенды клана','Clan legends and meme titles. Lore we will not forget.'],['Отзывы участников и соперников.','Reviews from members and opponents.'],
['Турниры и матчи команды.','Team tournaments and matches.'],['Ближайшие события','Upcoming events'],['Скримы, турниры и сборы клана.','Scrims, tournaments and clan meetups. Time is shown in your time zone.'],
['Итоги недели','Weekly recap'],['Коротко о том, что происходило','A short summary of what happened in the clan over the last 7 days.'],['Пригласи друга: получи ссылку','Invite a friend: get a link and +10 points'],
['Что нового','What\'s new'],['Новости и изменения в клане.','Clan news and changes.'],['Контент-план','Content plan'],['Что готовим и когда ждать.','What we are preparing and when to expect it.'],
['Активность клана','Clan activity'],['Созвоны, пик онлайна и рост состава.','Calls, peak online and roster growth.'],['Созвонов в неделю','Calls per week'],['Пик онлайна по часам','Peak online by hour'],
['Рост состава','Roster growth'],['По датам вступления участников.','By member join date.'],['Моя статистика','My stats'],['Введи свои цифры','Enter your numbers; they are stored only in your browser.'],
['Сохранить в таблицу','Save to leaderboard'],['Сохранить','Save'],['Сбросить','Reset'],['Для своих','Members only'],['Статусы участников.','Member statuses. A personal key from the clan admin is required.'],['Войти','Log in'],
['В тимспике','In TeamSpeak'],['На скриме','In a scrim'],['Оффлайн','Offline'],['Вызовы','Challenges'],['Кто первый выполнит условие','Whoever completes the condition first takes the reward. Tell us in Discord if you did.'],
['Вызов','Challenge'],['Награда','Reward'],['Статус заявки','Application status'],['Статус','Status'],['Таймер / победитель','Timer / winner'],['Опрос клана','Clan poll'],
['Голосуй, когда проводить','Vote on when to hold the next scrim. One vote per device.'],['Лента клана','Clan feed'],['Последние события из Discord.','Latest events from Discord.'],
['Комьюнити','Community'],['Кто сейчас на сайте','Who is on the site now, thanks for pushes and your referral link.'],['Сейчас на сайте: …','On the site now: …'],
['Только те, кто указал ник.','Only those who gave a nickname. Others are counted as anonymous.'],['Стена благодарностей','Wall of thanks'],['Скажи спасибо за пуш','Say thanks for a push in a competition. Limit: 5 messages per hour.'],
['Поблагодарить','Say thanks'],['Лента','Feed'],['Загружаю…','Loading…'],['Приглашай друзей','Invite friends'],['Твоя ссылка и счётчик','Your link and invite counter are also in your profile (LVL button).'],
['Смотри игры клана в прямом эфире.','Watch clan games live.'],['Игровая зона','Game zone'],['Дуэль с ботом, кейсы','Bot duel, cases for coins and HVH sounds. Rewards go to your profile.'],['HVH-дуэль','HVH duel'],
['Кейсы','Cases'],['Монеты берутся из профиля','Coins come from the profile at the top left.'],['Звуки HVH','HVH sounds'],['Экономика клана','Clan economy'],['Активность на сайте даёт опыт','Activity on the site gives XP and coins; coins open cases.'],
['Кошелёк','Wallet'],['Ежедневный бонус','Daily bonus'],['Как заработать:','How to earn: sections, poll, stats, thanks, application and bot duel. The balance is stored in your browser.'],
['Шансы кейсов','Case odds'],['Последние дропы','Latest drops'],['Пока пусто.','Nothing yet. Open a case in the game zone.'],['Подходишь ли ты клану?','Are you a fit for the clan?'],['Шесть вопросов','Six questions, result at the end.'],
['Рофл-конфиг','Joke config'],['Двигай ползунки','Move the sliders and copy. The config is a joke, not real.'],['Neverlose или Gamesense','Neverlose or Gamesense'],['Тип','Type'],['Платный софт','Paid software'],['Lua-скрипты','Lua scripts'],['Есть','Yes'],
['Где ищем конфиги','Where we look for configs'],['Discord клана','Clan Discord'],['Совет клана','Clan tip'],['Новичкам лучше спросить','Beginners should ask in Discord; we will advise for your game.'],['Конфиг-билдер','Config builder'],
['Выбери стиль, карту и роль','Pick a style, map and role to get a list of settings to enter manually in your software.'],['Агрессивный','Aggressive'],['Стабильный','Stable'],['Гибрид','Hybrid'],['Энтри','Entry'],['Опора','Anchor'],['Лёрк','Lurk'],
['Это рекомендация значений','These are recommended values, not a config file: we do not reproduce the formats of closed clients. Adjust them to your own'],['История клана','Clan history'],['Как мы к этому пришли.','How we got here.'],
['Избранные клипы','Favorite clips'],['Нажми сердечко на клипе','Tap the heart on a clip and it will appear here.'],['Галерея','Gallery'],['Скриншоты и моменты клана.','Clan screenshots and moments.'],
['30 секунд, летящие цели.','30 seconds, flying targets. Small ones give more points, golden ones x4, black bombs are a penalty. The best results go to the leaderboard.'],
['Таблица общая для всех','The table is shared by all players when the server is connected. Without it, records are stored only in this browser.'],['Коротко о том, как мы играем','A short note on how we play together.'],
['Задай вопрос клану.','Ask the clan a question. Answers are published after admin review.'],['Отправить','Send'],['Всё, что обычно спрашивают','Everything people usually ask before joining.'],['Мы в Discord','We are on Discord'],
['Кто сейчас онлайн на сервере.','Who is online on the server now. Press “Connect” to join.'],['Здесь мы собираемся на скримы','This is where we gather for scrims, discuss settings and post news. Applications are accepted in the channel'],
['Только официальные источники','Official sources only: buy from the developers, it is safer for your account and PC.'],['Платный софт с Lua-скриптами.','Paid software with Lua scripts. Purchase and loader on the official site.'],['Официальный сайт','Official site'],
['Не качай «бесплатные лоадеры»','Do not download “free loaders” and cracks from chats: they often contain password and Discord token stealers.'],['С чего начать, если ты только знакомишься','Where to start if you are new to HVH.'],
['Выбери софт.','Pick software.'],['Neverlose или Gamesense, купи','Neverlose or Gamesense, buy from the official seller (“Software” section).'],['Настрой базу.','Set up the basics.'],['Возьми значения из «Конфиг-билдера»','Take values from the “Config builder” and adjust them to yourself.'],
['Сыграй пару матчей','Play a few matches and review your demos.'],['Приходи к нам.','Come to us.'],['Подай заявку, мы подскажем','Apply and we will help with settings.'],['Hack vs Hack','Hack vs Hack: matches where everyone plays with software. The one with better settings and teamwork wins.'],
['Резолвер','Resolver'],['Функция, которая угадывает','A feature that guesses the real head angle of an opponent using anti-aim.'],['Анти-аим','Anti-aim'],['Настройки поворота модели','Model rotation settings that make you harder to hit.'],
['Режим, в котором выстрел','A mode where a shot counts only when it hits a guaranteed hitbox position.'],['Прицеливание в корпус','Aiming at the body instead of the head: more reliable when there is no resolver.'],['Lua-скрипт','Lua script'],
['Дополнение к софту','An add-on for the software written by community members. Install only from trusted sources.'],['Вызвать клан на скрим','Challenge the clan to a scrim'],['Заполни форму, скопируй сообщение','Fill in the form, copy the message and send it to the clan Discord.'],
['Команда','Team'],['Контакт в Discord','Discord contact'],['Формат','Format'],['Скопировать и открыть Discord','Copy and open Discord'],['Введи ник из заявки.','Enter the nickname from your application. We show the status only.'],['Ник','Nickname'],['Проверить','Check'],
['Разбор сыгранных игр','Review of played games: map, lineup, demo.'],['Заполни форму — заявка','Fill in the form and the application goes to Discord.'],['Другой','Other'],['Ответим в Discord.','We will reply in Discord. Watch your DMs and the #applications channel.'],
['Подай заявку в Discord — расскажи','Apply in Discord: tell us about yourself, show your skills and become part of the team.'],['Поддержать клан','Support the clan'],['Донаты идут на оборудование','Donations go to equipment, servers and tournament prizes.'],
['Ссылки с пометкой «партнёрская»','Links marked “partner” earn the clan a commission. The price does not change for you.'],['Конфиденциальность','Privacy'],['Установить приложение','Install app'],['Синий','Blue'],['Ч/Б','B/W'],['Время вышло','Time is up'],
['Время:','Time:'],['✕ Выйти','✕ Exit'],['Точность','Accuracy'],['Рекорд','Record']
],A=['placeholder','title','aria-label','alt','content'];
if(window.__X)S=S.concat(window.__X);var M={};S.forEach(function(p){M[p[0]]=p});
function en(v){var t=v.trim();if(!t||!/[А-Яа-яЁё]/.test(t))return null;if(M[t])return v.replace(t,M[t][1]);
 for(var i=0;i<S.length;i++){var k=S[i][0];if(t.indexOf(k)===0&&(k.length>=12||/[:+]$/.test(k))){return /[А-Яа-яЁё]/.test(t.slice(k.length))?v.replace(t,S[i][1]):v.replace(k,S[i][1])}}return null}
var old=new WeakMap();
function node(n,on){if(n.parentNode&&n.parentNode.closest&&n.parentNode.closest('script,style,code'))return;
 if(on){var r=en(n.nodeValue);if(r!==null){if(!old.has(n))old.set(n,n.nodeValue);n.nodeValue=r}}else if(old.has(n)){n.nodeValue=old.get(n);old.delete(n)}}
function attrs(e,on){A.forEach(function(a){if(a==='content'&&e.tagName!=='META')return;var k='i18n-'+a;
 if(on){var v=e.getAttribute(a),r=v&&en(v);if(r!==null&&r!==undefined){if(!e.hasAttribute(k))e.setAttribute(k,v);e.setAttribute(a,r)}}
 else if(e.hasAttribute(k)){e.setAttribute(a,e.getAttribute(k));e.removeAttribute(k)}})}
function walk(root,on){var w=document.createTreeWalker(root,5),n;while(n=w.nextNode()){if(n.nodeType===3)node(n,on);else attrs(n,on)}}
var busy=0;function run(){if(busy)return;busy=1;var on=R.lang==='en';walk(document.body,on);attrs(document.documentElement,on);if(!R.__t)R.__t=document.title;document.title=on?(en(R.__t)||R.__t):R.__t;busy=0}
new MutationObserver(run).observe(R,{attributes:true,attributeFilter:['lang']});
new MutationObserver(function(ms){if(busy||R.lang!=='en')return;busy=1;ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===3)node(n,true);else if(n.nodeType===1)walk(n,true)});if(m.type==='characterData')node(m.target,true)});busy=0})
 .observe(document.body,{childList:true,subtree:true,characterData:true});
if(R.lang==='en')run();else try{if(localStorage.getItem('lang')==='en')setTimeout(run,0)}catch(e){}
})();
