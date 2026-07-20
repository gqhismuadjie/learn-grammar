// Auto-extracted grammar content data (pure data, no logic).
export const UNITS = [
  {
    id: 1, title: "Articles", tag: "a / an / the / Ø",
    learn: [
      { h: "a / an — non-specific", b: [
        "Something non-specific, or mentioned for the first time: “I saw a movie yesterday.”",
        "One of many possible things: “The company added an extra service last year.”",
        "Only before singular, countable nouns: “There is a significant increase in sales.”",
      ]},
      { h: "the — specific", b: [
        "Something both speaker and listener know, or already mentioned: “I enjoyed the movie we watched.”",
        "Unique things and systems: “invest in the education system”.",
        "Superlatives and specific places: “the largest building”, “the Eiffel Tower”.",
      ]},
      { h: "Ø — no article", b: [
        "Plural and uncountable nouns in general statements: “Technology is advancing.” “I love nature.”",
        "Most proper nouns: “I have been to Paris.”",
      ]},
    ],
    quiz: [
      { q: "___ number of students studying abroad increased significantly between 2010 and 2020.", opts: ["A", "The", "Ø (no article)"], a: 1, ex: "‘The number of…’ refers to a specific quantity, so it takes ‘the’ (and a singular verb)." },
      { q: "The company introduced ___ new product line last quarter.", opts: ["a", "an", "the"], a: 0, ex: "First mention of one product line among many possible ones → a." },
      { q: "Sales of ___ laptops rose by 15% over the period.", opts: ["the", "Ø (no article)", "an"], a: 1, ex: "A plural noun used in a general sense takes no article." },
      { q: "…making them ___ most popular item.", opts: ["a", "the", "Ø (no article)"], a: 1, ex: "Superlatives always take ‘the’: the most popular." },
      { q: "There was ___ slight increase in sales, followed by a period of stability.", opts: ["a", "the", "Ø (no article)"], a: 0, ex: "One non-specific increase, introduced for the first time → a." },
      { q: "The proportion of households using electricity increased by 10% over ___ three-year period.", opts: ["Ø (no article)", "a", "the"], a: 1, ex: "One unspecified period of that length → a three-year period." },
      { q: "In 2021, there was ___ significant decrease in the number of university graduates.", opts: ["the", "a", "Ø (no article)"], a: 1, ex: "‘A significant decrease’ introduces it for the first time → a." },
      { q: "I have been to ___ Paris.", opts: ["the", "a", "Ø (no article)"], a: 2, ex: "Most cities and countries are proper nouns and take no article." },
    ],
  },
  {
    id: 2, title: "Nouns", tag: "Countable, uncountable & quantifiers",
    learn: [
      { h: "Countable vs uncountable", b: [
        "Uncountables (research, news, advice, evidence, information, furniture) have no plural, no a/an, and take a singular verb: “The evidence is strong.”",
        "Measure them with quantifiers: “a piece of advice”, “a cup of tea”, “a slice of bread”.",
      ]},
      { h: "some vs any", b: [
        "some → positive statements, offers and requests: “Would you like some tea?”",
        "any → negatives and questions: “I don’t have any money.” Also ‘any = it doesn’t matter which’: “Take any book you like.”",
      ]},
      { h: "Quantifiers", b: [
        "Countable: many, a few, a large number of. Uncountable: much, a little, a large amount of. Both: a lot of, plenty of, some, no.",
        "few / little = not enough (“Only few students understood”). a few / a little = some, sufficient (“We have a little time to discuss this”).",
      ]},
      { h: "Making Uncountables Countable (Partitives)", b: ["Uncountable nouns cannot take a/an or a plural -s on their own. To count them we add a partitive: a piece of / an item of + advice, news, information, equipment, furniture, research. “She gave me a good piece of advice.”", "Different uncountables prefer their own partitives. Money and water are typical: a sum of money, a drop of water. “He saved a large sum of money.” and “There isn’t a drop of water left.”", "Food often has a fixed partitive. Bread uses a slice of (one piece) or a loaf of (the whole thing). “I ate a slice of bread.” and “We bought a loaf of bread.”", "In informal spoken English we sometimes count servings directly, so the drink itself becomes countable. “Two coffees, please.” simply means two cups of coffee.", "Watch the classic errors: ✗ an advice → “a piece of advice”; ✗ informations → “information” (no -s); ✗ a slice of advice → the wrong partitive; use the right one."] },
    ],
    quiz: [
      { q: "There is very ___ information available on this topic.", opts: ["little", "few", "many"], a: 0, ex: "‘Information’ is uncountable → little (few is for countables)." },
      { q: "I have ___ ideas about how to solve the problem.", opts: ["a few", "any", "much"], a: 0, ex: "‘Ideas’ is countable and the sentence is positive → a few." },
      { q: "They gave me ___ of advice, which was really helpful.", opts: ["a slice", "a piece", "a number"], a: 1, ex: "‘Advice’ is uncountable — measure it with ‘a piece of advice’." },
      { q: "She has ___ experience in this field.", opts: ["many", "a lot of", "a few"], a: 1, ex: "‘Experience’ (skill and knowledge) is uncountable → a lot of." },
      { q: "I need to buy ___ furniture for my new apartment.", opts: ["some", "many", "a few"], a: 0, ex: "‘Furniture’ is uncountable → some (many / a few need countable nouns)." },
      { q: "There isn’t ___ time left before the exam starts.", opts: ["many", "much", "a few"], a: 1, ex: "Negative sentence + uncountable ‘time’ → much." },
      { q: "They conducted ___ research before making the decision.", opts: ["many", "few", "a lot of"], a: 2, ex: "‘Research’ is uncountable → a lot of (never ‘many researches’)." },
      { q: "Which version is correct?", opts: ["There are many evidences to suggest this.", "There is a lot of evidence to suggest this.", "There are much evidences to suggest this."], a: 1, ex: "‘Evidence’ is uncountable: a lot of evidence, with a singular verb." },
      { q: "During the seminar, the professor shared a valuable ___ of advice with the students.", opts: ["piece","slice","loaf","drop"], a: 0, ex: "'Advice' is uncountable, so it is counted with the partitive 'a piece of advice'. 'Slice', 'loaf', and 'drop' are the wrong partitives here." },
      { q: "The engineers installed an expensive ___ of equipment in the new factory.", opts: ["piece","pieces","equipment","equipments"], a: 0, ex: "'Equipment' is uncountable and never takes -s. Use 'a piece of equipment' (singular after 'an'); 'pieces' and 'equipments' are both wrong." },
    ],
  },
  {
    id: 3, title: "Prepositions", tag: "Dependent prepositions & phrases",
    learn: [
      { h: "Verb + preposition", b: [
        "worry / think / care about · apply / prepare / wait for · rely / depend / concentrate on",
        "deal / cope with · choose / distinguish between · learn / protect from · speak / listen to",
      ]},
      { h: "Adjective + preposition", b: [
        "interested / successful in · responsible / qualified for · capable / afraid of",
        "satisfied / pleased with · excited / worried about · impressed / surprised by",
      ]},
      { h: "Noun + preposition", b: [
        "increase / decrease / rise in · impact / effect / influence on",
        "demand / reason / need for · information / knowledge about · advantage / fear of",
      ]},
      { h: "When unsure", b: [
        "Check a collocation dictionary such as m.freecollocation.com to see which prepositions follow a word.",
      ]},
      { h: "Time & place: at / on / in", b: ["Clock times, plus ‘night’ and ‘the weekend’, take at: “The class starts at 8 o’clock.” “I study at night.” “We relax at the weekend.”", "Days and dates take on — including a part of a specific day: “We meet on Monday.” “The exam is on 5 June.” “The bus leaves on Monday morning.” ✗ in Monday.", "Months, years, seasons and parts of the day take in: “in July”, “in 2020”, “in winter”, “in the morning.” ✗ at the morning.", "Place: at a point or building, on a surface or line, in an enclosed space, a city or a country: “at the door”, “on the table”, “in the kitchen”, “in Jakarta.”", "With ‘arrive’, use arrive in a city and arrive at a building — never ‘arrive to’: “They arrived in London.” “We arrived at the hotel.” ✗ arrive to."] },
    ],
    quiz: [
      { q: "He is interested ___ studying medicine.", opts: ["of", "in", "on"], a: 1, ex: "Interested in — adjective + in." },
      { q: "The company will concentrate ___ improving its services.", opts: ["at", "with", "on"], a: 2, ex: "Concentrate / rely / depend / insist on." },
      { q: "They are responsible ___ organizing the event.", opts: ["for", "to", "in"], a: 0, ex: "Responsible for — like reason for, demand for." },
      { q: "He shouted ___ the kids to be quiet.", opts: ["to", "at", "with"], a: 1, ex: "Shout / yell / point at someone." },
      { q: "We need to prepare ___ the exam tomorrow.", opts: ["for", "on", "of"], a: 0, ex: "Prepare / apply / wait / hope for." },
      { q: "She is capable ___ managing a large team.", opts: ["on", "of", "in"], a: 1, ex: "Capable of + -ing." },
      { q: "The rise ___ online learning has changed education.", opts: ["on", "at", "in"], a: 2, ex: "A rise / increase / decrease in something." },
      { q: "The new law had a significant impact ___ the environment.", opts: ["on", "in", "to"], a: 0, ex: "An impact / effect / influence on something." },
      { q: "The conference will be held ___ July, and the opening speech starts ___ 9 a.m.", opts: ["in / at","on / in","at / on","in / on"], a: 0, ex: "Months take in (in July); clock times take at (at 9 a.m.)." },
      { q: "Most delegates arrive ___ the city on Sunday and stay ___ a hotel near the centre.", opts: ["in / at","to / in","at / to","in / to"], a: 0, ex: "Use arrive in for a city — never ‘arrive to’ — and stay at for a building: arrive in the city, stay at a hotel." },
    ],
  },
  {
    id: 4, title: "Comparing", tag: "Comparatives & superlatives",
    learn: [
      { h: "Comparatives", b: [
        "Short adjective + -er, or more + long adjective, then ‘than’: “cheaper than”, “more impressive than”.",
        "Never double it: ✗ more cheaper → ✓ cheaper. Equal things: as + adjective + as.",
      ]},
      { h: "Superlatives", b: [
        "the + -est / the most … for groups of three or more: “the best English course I’ve taken”.",
        "Drop ‘the’ after possessives: ✗ our the best package → ✓ our best package.",
      ]},
      { h: "Making them stronger", b: [
        "slightly / significantly / considerably / far + comparative: “far more expensive”.",
        "easily / by far / nearly + the superlative: “by far the hardest section”.",
        "Double comparative for change: “The more you practice, the more fluent you will become.”",
      ]},
    ],
    quiz: [
      { q: "Public transport in my city is ___ than it used to be.", opts: ["the most convenient", "more convenient", "as convenient"], a: 1, ex: "Long adjective → more + adjective + than." },
      { q: "This year’s exam results were ___ than last year’s.", opts: ["higher", "highest", "the most high"], a: 0, ex: "Short adjective → -er + than." },
      { q: "The cost of living in City A is ___ than in City B.", opts: ["more cheaper", "the cheapest", "cheaper"], a: 2, ex: "Never ‘more cheaper’ — cheap is short, so just cheaper." },
      { q: "The climate in my country is getting ___ every year.", opts: ["hotter and hotter", "more hot", "the most hot"], a: 0, ex: "Repeating the comparative shows continuing change." },
      { q: "My writing task was ___ than the speaking task.", opts: ["more difficult", "the most difficult", "difficult than"], a: 0, ex: "Long adjective → more difficult than." },
      { q: "English is ___ to learn than many other languages.", opts: ["the most easy", "easier", "more easier"], a: 1, ex: "easy → easier; ‘more easier’ doubles the comparative." },
      { q: "This hotel is ___ than the one we stayed at last year.", opts: ["far more expensive", "the most expensive", "more expensively"], a: 0, ex: "‘Far’ strengthens a comparative: far more expensive." },
      { q: "The more you practice, ___ your English will become.", opts: ["the most fluent", "more fluent", "the more fluent"], a: 2, ex: "The + comparative…, the + comparative…" },
    ],
  },
  {
    id: 5, title: "S-V Agreement", tag: "Subject–verb agreement",
    learn: [
      { h: "The basics", b: [
        "Singular subject → singular verb; plural → plural: “The student studies.” “The students study.”",
        "Subjects joined by ‘and’ → plural. With or / nor, the verb agrees with the nearest subject: “Neither the teacher nor the students were happy.”",
      ]},
      { h: "Pronouns & quantifiers", b: [
        "everyone / someone / each / every → singular. few / many / several → plural.",
        "some / all / none → depends on the noun that follows: “Some of the information is outdated.” “Some of the questions are difficult.”",
        "“The number of…” → singular. “A number of…” → plural.",
      ]},
      { h: "Tricky cases", b: [
        "There is / are agrees with the subject after the verb: “There are many studies…”",
        "Titles, countries, sums and periods → singular: “The United States is…”, “Ten dollars is too expensive.” Mathematics is singular.",
        "Watch out when the subject is far from the verb: “The results of the experiment were inconclusive.”",
      ]},
    ],
    quiz: [
      { q: "The number of students applying to universities ___ increased this year.", opts: ["has", "have", "are having"], a: 0, ex: "‘The number of’ is singular → has." },
      { q: "Crime rates in urban areas ___ higher than in rural areas.", opts: ["is", "are", "be"], a: 1, ex: "The subject is plural ‘crime rates’ → are." },
      { q: "Neither the teacher nor the students ___ aware of the new exam schedule.", opts: ["was", "were", "is"], a: 1, ex: "With neither…nor, the verb agrees with the nearest subject: students → were." },
      { q: "Regular exercise and a balanced diet ___ improve mental health.", opts: ["helps", "help", "helping"], a: 1, ex: "Two subjects joined by ‘and’ take a plural verb." },
      { q: "Every one of the essays ___ being graded by the professor.", opts: ["is", "are", "were"], a: 0, ex: "‘Every one of…’ is singular → is." },
      { q: "A lot of research ___ been conducted on how crime affects communities.", opts: ["have", "has", "are"], a: 1, ex: "‘Research’ is uncountable, so it takes a singular verb → has." },
      { q: "Some of the information in the report ___ outdated.", opts: ["are", "is", "were"], a: 1, ex: "‘Some of’ + uncountable ‘information’ → singular: is." },
      { q: "Mathematics ___ a challenging subject for many students.", opts: ["are", "is", "be"], a: 1, ex: "Mathematics looks plural but is singular in meaning." },
    ],
  },
  {
    id: 6, title: "Past Tenses", tag: "Simple, continuous, perfect",
    learn: [
      { h: "Past simple", b: [
        "Completed actions and sequences: “Last month, the company launched a new product.”",
        "Past habits and situations no longer true: “I lived in that house for almost 10 years.”",
      ]},
      { h: "used to / would", b: [
        "Repeated past actions: “He used to play football every weekend.”",
        "used to also covers past states: “Emma used to live in Spain.” Don’t use ‘would’ with state verbs, and don’t use ‘used to’ with durations.",
      ]},
      { h: "Past continuous", b: [
        "In progress at a past moment: “At 8pm last night, I was watching a documentary.”",
        "Background interrupted by past simple: “She was cooking dinner when her friend knocked.”",
      ]},
      { h: "Past perfect (had + V3)", b: [
        "The earlier of two past events: “When I got home, my mother had made me lunch.”",
        "Often with by the time / already / before, or to show a cause: “He was tired because he had not slept well.”",
      ]},
      { h: "Past perfect continuous", b: [
        "Duration up to a past point: “They had been waiting for over an hour when the bus finally arrived.”",
      ]},
    ],
    quiz: [
      { q: "She ___ to Paris last summer and ___ the Eiffel Tower.", opts: ["traveled, visited", "was traveling, was visiting", "had traveled, had visited"], a: 0, ex: "Two completed actions in sequence → past simple + past simple." },
      { q: "They ___ in the mountains when a sudden storm ___.", opts: ["hiked, hit", "were hiking, hit", "had hiked, was hitting"], a: 1, ex: "A background action in progress (were hiking) interrupted by past simple (hit)." },
      { q: "By the time he ___ at the party, everyone ___.", opts: ["was arriving, had already left", "arrived, had been leaving", "arrived, had already left"], a: 2, ex: "The earlier action takes past perfect: had already left." },
      { q: "I ___ for hours before I finally ___ to take a break.", opts: ["studied, was deciding", "had been studying, decided", "was studying, had decided"], a: 1, ex: "Duration before a past event → past perfect continuous, then past simple." },
      { q: "The cat ___ onto the table and ___ over a glass of water.", opts: ["jumped, knocked", "was jumping, was knocking", "had jumped, had knocked"], a: 0, ex: "A quick sequence of finished actions → past simple." },
      { q: "While she ___, her phone ___ unexpectedly.", opts: ["cooked, rang", "had cooked, was ringing", "was cooking, rang"], a: 2, ex: "Action in progress (was cooking) interrupted by a shorter one (rang)." },
      { q: "He ___ his report before the deadline, so he ___ relieved.", opts: ["had finished, felt", "was finishing, had felt", "finished, had been feeling"], a: 0, ex: "Finishing came first → past perfect; then past simple ‘felt’." },
      { q: "They ___ for the bus for thirty minutes when it finally ___.", opts: ["waited, was arriving", "had been waiting, arrived", "were waiting, had arrived"], a: 1, ex: "The waiting continued up to the arrival → had been waiting + arrived." },
    ],
  },
  {
    id: 7, title: "Present Tenses", tag: "Simple, continuous, perfect",
    learn: [
      { h: "Present simple", b: [
        "Routines and repeated actions: “I usually practice my speaking with a language partner.”",
        "Permanent facts, general truths, instructions and timetables.",
      ]},
      { h: "Present continuous", b: [
        "Temporary situations and actions happening now: “I’m currently preparing for the IELTS exam.”",
        "Trends and changes: “More and more students are choosing to take the IELTS test.”",
        "State verbs (know, believe, want, need…) are not normally continuous.",
      ]},
      { h: "Present perfect (have + V3)", b: [
        "Unfinished time frames and past events with present relevance: “I’ve completed three tasks this afternoon.”",
        "for / since for situations that continue: “We’ve worked together for three months.”",
        "If you state when it happened, switch to past simple: “We finished the project yesterday.”",
      ]},
      { h: "Present perfect continuous", b: [
        "Emphasizes duration or the activity itself: “I’ve been working on my project.”",
        "The simple form emphasizes result or count: “I’ve written two reports today.”",
      ]},
      { h: "Stative verbs: verbs that resist the -ing form", b: ["State verbs describe a condition, not an action, so they normally stay in the Present Simple even for ‘right now’. Verbs like know, believe, understand, own, belong, seem, contain and need cannot take -ing: “I know the answer.” not “I am knowing the answer.”", "Feelings and preferences are states too: like, love, hate, prefer, want. In careful English we write “I love this song.” and “She prefers tea.”, never “I am loving” or “She is preferring”.", "Some verbs shift meaning. As an opinion, think is a state: “I think you’re right.” But be thinking means considering an action in progress: “I’m thinking about changing jobs.”", "have for possession is a state — “I have a car.” (never “I’m having a car”) — but be having means experiencing an activity: “We’re having dinner.”, “She’s having a shower.”, “I’m having trouble.”", "see for understanding is a state: “I see what you mean.” But be seeing means meeting by arrangement: “I’m seeing the dentist at three.”"] },
    ],
    quiz: [
      { q: "Many people ___ that learning English can improve job prospects.", opts: ["believe", "are believing", "have believed"], a: 0, ex: "‘Believe’ is a state verb → present simple." },
      { q: "I ___ English for the last six months to prepare for the IELTS exam.", opts: ["study", "am studying", "have been studying"], a: 2, ex: "Duration up to now (for the last six months) → present perfect continuous." },
      { q: "___ an English proficiency exam before?", opts: ["Have you ever taken", "Are you ever taking", "Do you ever take"], a: 0, ex: "‘Ever … before’ (experience up to now) → present perfect." },
      { q: "The government ___ heavily in renewable energy at the moment.", opts: ["invests", "is investing", "has invested"], a: 1, ex: "A temporary, ongoing action (at the moment) → present continuous." },
      { q: "I ___ my essay yet, but I will submit it by tomorrow.", opts: ["haven’t finished", "didn’t finish", "don’t finish"], a: 0, ex: "‘Yet’ links the past to now → present perfect negative." },
      { q: "I ___ for my exam, so I can’t go out tonight.", opts: ["prepare", "prepared", "am preparing"], a: 2, ex: "Happening around now and temporary → am preparing." },
      { q: "The pie chart ___ the distribution of different sources of energy.", opts: ["shows", "is showing", "has shown"], a: 0, ex: "Charts state facts → present simple: shows." },
      { q: "We ___ together on this project for three months, and we’re still working on it.", opts: ["have worked", "are working", "worked"], a: 0, ex: "Started in the past and still true (for three months) → present perfect." },
      { q: "Sorry, I ___ what this word means — could you explain it again?", opts: ["don’t know","am not knowing","not knowing","isn’t knowing"], a: 0, ex: "‘Know’ is a stative verb describing a mental state, so it never takes the -ing form. Use the Present Simple: ‘I don’t know’, never ‘I am not knowing’." },
      { q: "Please be quiet for a moment — I ___ about your offer and I’ll give you an answer soon.", opts: ["am thinking","think","thinks","am knowing"], a: 0, ex: "Here ‘think’ means ‘consider’, an action in progress, so the continuous is correct: ‘I’m thinking about it.’ (For an opinion — ‘I think you’re right’ — use the simple form.)" },
    ],
  },
  {
    id: 8, title: "Future Tenses", tag: "will, going to, perfect forms",
    learn: [
      { h: "will", b: [
        "Decisions made at the moment of speaking, offers and promises: “That box looks heavy — I’ll help you.”",
        "Predictions based on opinion. In formal writing, also: is likely to / is predicted to / is estimated to.",
      ]},
      { h: "going to & arrangements", b: [
        "Plans made before speaking: “I’m going to apply for a new position next month.”",
        "Predictions from present evidence: “The sky is darkening — it’s going to rain.”",
        "Present continuous for fixed arrangements; present simple for timetables: “The train departs at 6 PM.”",
      ]},
      { h: "Future continuous (will be + V-ing)", b: [
        "In progress at a future time: “I’ll be working on the report all next week.”",
        "Polite questions about plans: “Will you be joining us for lunch?”",
      ]},
      { h: "Future perfect (will have + V3)", b: [
        "Completed before a future point, with by / by the time / in + time: “By the time you get home, I will have cooked dinner.”",
      ]},
      { h: "Future perfect continuous", b: [
        "Duration up to a future point: “By the end of this year, I’ll have been teaching at the school for five years.”",
      ]},
    ],
    quiz: [
      { q: "Based on current progress, humans ___ on Mars by the year 2100.", opts: ["will be living", "will have lived"], a: 0, ex: "In progress at a future time (life in 2100) → future continuous." },
      { q: "Limited resources on Mars mean traditional farming ___ an option.", opts: ["won’t be", "won’t have been"], a: 0, ex: "A simple future state → won’t be." },
      { q: "By 2100, space-grown produce ___ a common part of our diet.", opts: ["will have been", "will be"], a: 1, ex: "Describing a state at that future time → will be." },
      { q: "In around 80 years’ time, we ___ through space on a regular basis.", opts: ["’ll be traveling", "’ll have traveled"], a: 0, ex: "An activity in progress at that future time → future continuous." },
      { q: "By then, space tourism ___, and more people will be exploring the solar system.", opts: ["will have been expanding", "will have expanded"], a: 1, ex: "Completed before that point → future perfect." },
      { q: "Space stations ___ as permanent homes for thousands of people.", opts: ["will likely serve", "will have been serving"], a: 0, ex: "A simple prediction about their future role → will likely serve." },
      { q: "By 2050, many individuals ___ in these colonies for several years already.", opts: ["will be living", "will have been living"], a: 1, ex: "Duration up to a future point (for several years) → future perfect continuous." },
      { q: "By the year 2065, treaties to manage space resources ___.", opts: ["will have expired", "will be expiring"], a: 0, ex: "Completed by 2065 → future perfect." },
    ],
  },
  {
    id: 9, title: "Passive Voice", tag: "be + V3 across tenses",
    learn: [
      { h: "The form: be + V3", b: [
        "The issue is discussed · is being discussed · was discussed · was being discussed · has been discussed · had been discussed · will be discussed · is going to be discussed.",
        "Also with modals and semi-modals: “should be addressed”, “needs to be scheduled”, “used to be occupied”.",
      ]},
      { h: "When to use it", b: [
        "When the object matters more than the doer: “All complaints are handled within 48 hours.”",
        "When the agent is unknown or unimportant: “The decision was made yesterday.”",
        "For a formal, impersonal academic tone, and for describing processes and maps in Writing Task 1: “The product is manufactured in three stages.”",
      ]},
    ],
    quiz: [
      { q: "The documents ___ by the committee at the moment.", opts: ["are reviewing", "are being reviewed", "review"], a: 1, ex: "‘At the moment’ → present continuous passive: are being reviewed." },
      { q: "The report ___ yesterday by the project manager.", opts: ["was submitted", "submitted", "is submitted"], a: 0, ex: "‘Yesterday’ → past simple passive: was submitted." },
      { q: "The results ___ in several journals already.", opts: ["have published", "are publish", "have been published"], a: 2, ex: "‘Already’, with present relevance → present perfect passive." },
      { q: "The machines ___ regularly to ensure safety.", opts: ["are inspected", "are inspecting", "inspect"], a: 0, ex: "A routine → present simple passive: are inspected." },
      { q: "New policies ___ across the country last year.", opts: ["are implemented", "were implemented", "implemented"], a: 1, ex: "‘Last year’ → past simple passive: were implemented." },
      { q: "The stadium ___ when I visited the city last year.", opts: ["is being renovated", "renovated", "was being renovated"], a: 2, ex: "In progress during a past visit → past continuous passive." },
      { q: "This project ___ by the board next week.", opts: ["will be approved", "will approve", "is approving"], a: 0, ex: "‘Next week’ → future passive: will be approved." },
      { q: "Make it passive: “Scientists are conducting experiments.”", opts: ["Experiments are conducting.", "Experiments are being conducted.", "Experiments have been conducted."], a: 1, ex: "Present continuous active → present continuous passive: are being conducted." },
    ],
  },
  {
    id: 10, title: "Conditionals", tag: "First, second, third & mixed",
    learn: [
      { h: "First — real & possible", b: [
        "If + present, will: “If governments invest in renewable energy, they will reduce carbon emissions.”",
      ]},
      { h: "Second — unreal now or future", b: [
        "If + past simple, would / might / could: “If everyone recycled, the amount of waste would decrease.”",
        "With be, use were: “If I were the president…”",
      ]},
      { h: "Third — unreal past", b: [
        "If + past perfect, would / could / might have + V3: “If I had studied harder, I could have passed the exam.”",
      ]},
      { h: "Mixed — past condition, present result", b: [
        "If + past perfect, would + base verb: “If I had studied medicine, I would be a doctor now.”",
      ]},
    ],
    quiz: [
      { q: "If I ___ more free time, I would travel around the world.", opts: ["had", "will have", "would have"], a: 0, ex: "Second conditional: If + past simple … would + base verb." },
      { q: "If you had told me earlier, I ___ you.", opts: ["would help", "would have helped", "will help"], a: 1, ex: "Third conditional result → would have + V3." },
      { q: "If you don’t study, you ___ the exam.", opts: ["won’t pass", "wouldn’t pass", "wouldn’t have passed"], a: 0, ex: "A real, likely situation → first conditional: will / won’t." },
      { q: "If I ___ the president, I would implement new policies.", opts: ["am", "had been", "were"], a: 2, ex: "Unreal present with ‘be’ → If I were." },
      { q: "If people used fewer plastic products, pollution ___ dramatically.", opts: ["will decrease", "would decrease", "would have decreased"], a: 1, ex: "Second conditional result → would decrease." },
      { q: "If I had started university earlier, I ___ my degree by now.", opts: ["would have finished", "would finish", "will finish"], a: 0, ex: "An unreal past condition → would have + V3." },
      { q: "If governments invest in renewable energy, they ___ carbon emissions.", opts: ["would reduce", "would have reduced", "will reduce"], a: 2, ex: "A real future possibility → first conditional: will reduce." },
      { q: "If I had studied medicine, I ___ a doctor now.", opts: ["would be", "would have been", "will be"], a: 0, ex: "Mixed conditional: past condition, present result → would be … now." },
    ],
  },
  {
    id: 11, title: "Modals", tag: "Ability, possibility, obligation",
    learn: [
      { h: "Ability & possibility", b: [
        "can (present ability) · could (past ability) · be able to when ‘can’ isn’t possible: “In the future, we will be able to solve many issues.”",
        "may / might / could = less certain than will: “This solution might improve the economy.”",
      ]},
      { h: "Past possibility & deduction", b: [
        "could / might / may have + V3 for past possibilities: “He may have missed the train.”",
        "must have + V3 = sure it happened: “She must have left early — her coat is gone.” can’t have + V3 = sure it didn’t.",
      ]},
      { h: "Obligation & advice", b: [
        "must / have to / need to (obligation) · had to (past obligation).",
        "should have + V3 = regret or criticism about the past: “I should have studied harder.”",
        "should / ought to for advice · had better warns of consequences: “You had better prepare, or you might not pass.”",
      ]},
      { h: "IELTS tip", b: [
        "Modals tune the strength of your opinion: “could lead to” sounds more balanced than “will lead to”.",
      ]},
    ],
    quiz: [
      { q: "I ___ to the concert, but I had to study instead.", opts: ["could have gone", "could go", "can have gone"], a: 0, ex: "A past possibility that didn’t happen → could have + V3." },
      { q: "She ___ left early, because her coat is gone.", opts: ["should have", "must have", "can have"], a: 1, ex: "Sure about the past based on evidence → must have." },
      { q: "He ___ finished his work so quickly — it’s too complex.", opts: ["mustn’t have", "shouldn’t", "can’t have"], a: 2, ex: "Certain something was impossible in the past → can’t have." },
      { q: "I ___ harder for the exam. Now I regret it.", opts: ["should have studied", "must have studied", "could study"], a: 0, ex: "Regret about the past → should have + V3." },
      { q: "You ___ prepare for the exam, or you might not pass.", opts: ["would rather", "had better", "could"], a: 1, ex: "‘Had better’ implies negative consequences if the advice is ignored." },
      { q: "Governments ___ invest in education to improve society.", opts: ["might", "can", "must"], a: 2, ex: "A strong obligation or necessity → must." },
      { q: "This solution ___ improve the economy, but we can’t be sure.", opts: ["might", "must", "will"], a: 0, ex: "An uncertain possibility → might." },
      { q: "In the future, we ___ solve many environmental issues through technology.", opts: ["can", "will be able to", "could"], a: 1, ex: "‘Can’ has no future form → will be able to." },
    ],
  },
  {
    id: 12, title: "Relative Clauses", tag: "who, which, that, whose…",
    learn: [
      { h: "Defining clauses", b: [
        "Essential information, no commas: “The book that I borrowed from the library was fascinating.”",
        "You can drop who / which / that when it’s the object: “The hotel (that) we stayed at was wonderful.”",
      ]},
      { h: "Non-defining clauses", b: [
        "Extra information between commas: “My brother, who lives in Australia, is visiting next month.”",
        "Never use ‘that’, and never drop the pronoun, in non-defining clauses.",
      ]},
      { h: "whose / where / when", b: [
        "whose = possession: “The student whose project won the prize is from Indonesia.”",
        "where = place: “The café where we met is now closed.” when = time: “I remember the day when we first met.”",
      ]},
      { h: "Reduced relative clauses", b: ["You can shorten a relative clause only when the relative pronoun is the SUBJECT (who/which/that + verb). Drop the pronoun and the be-verb, then use a participle: “the students who are waiting outside” → “the students waiting outside”.", "If the meaning is ACTIVE (the noun DOES the action), use the present participle (-ing): “the people who live in cities” → “the people living in cities”.", "If the meaning is PASSIVE (the noun RECEIVES the action), use the past participle (V3): “the data which was collected in 2020” → “the data collected in 2020”.", "The main trap is choosing the wrong voice. Ask: does the noun DO or RECEIVE the action? “letters written yesterday” (letters are written — passive), never “letters writing”.", "OBJECT relative clauses cannot reduce to a participle. In “the book that I read”, the subject is “I”, so you only drop the pronoun: “the book I read” — never “the book reading”."] },
    ],
    quiz: [
      { q: "The athlete ___ won the gold medal is from Brazil.", opts: ["which", "who", "where"], a: 1, ex: "A person as the subject → who (or that)." },
      { q: "This is the stadium ___ the final match will be played.", opts: ["where", "which", "who"], a: 0, ex: "A place → where." },
      { q: "The coach, ___ strategy led the team to victory, is retiring this year.", opts: ["who", "which", "whose"], a: 2, ex: "Possession (the coach’s strategy) → whose." },
      { q: "The year ___ I started playing tennis was unforgettable.", opts: ["when", "where", "which"], a: 0, ex: "A time → when." },
      { q: "I met the player ___ father is the head of the sports federation.", opts: ["who", "whose", "whom"], a: 1, ex: "Possession (the player’s father) → whose." },
      { q: "The equipment ___ was used for the competition is brand new.", opts: ["which", "who", "where"], a: 0, ex: "A thing → which (or that)." },
      { q: "The team ___ practices the hardest usually performs well.", opts: ["where", "that", "when"], a: 1, ex: "A defining clause about a team → that (or which)." },
      { q: "My brother, ___ lives in Australia, is visiting next month.", opts: ["that", "who", "whose"], a: 1, ex: "Non-defining clauses (with commas) need who — never ‘that’." },
      { q: "The data ___ during the 2020 study revealed a significant trend.", opts: ["which collected","collected","collecting","which collecting"], a: 1, ex: "The data is collected, so the meaning is passive. A reduced subject relative clause in the passive uses the past participle: 'the data collected during the study'. 'which collected' wrongly makes the data the doer." },
      { q: "Researchers ___ in remote areas often rely on satellite phones.", opts: ["who works","working","worked","who working"], a: 1, ex: "The researchers do the working, so the meaning is active. A reduced active clause uses the present participle: 'researchers working in remote areas'. 'worked' would wrongly sound passive and 'who works' fails plural agreement." },
    ],
  },
  {
    id: 13, title: "Complex Sentences", tag: "Clauses & conjunctions",
    learn: [
      { h: "Clauses & punctuation", b: [
        "An independent clause stands alone; a dependent clause starts with because / although / when / if… and cannot.",
        "No comma splices: join two independent clauses with a conjunction or a full stop. No fragments: attach dependent clauses to an independent one.",
      ]},
      { h: "Cause & effect", b: [
        "because / since / as + clause · because of / due to / as a result of + noun · so shows the effect.",
      ]},
      { h: "Contrast", b: [
        "although / even though / though + clause · while for contrast · despite / in spite of + noun: “Despite the challenges, online learning is growing.”",
      ]},
      { h: "Purpose & time", b: [
        "so that + clause · in order to + verb. Time: when, while, before, after, until, once, as soon as.",
      ]},
      { h: "Band 7 note", b: [
        "You don’t need very long, complicated sentences for band 7 — accurate variety wins.",
      ]},
      { h: "Noun clauses (klausa yang berperan sebagai kata benda)", b: ["A noun clause does the job of a noun, so it can be the OBJECT of a verb like find, show, know, or think: “Researchers found that sleep improves memory.” The word that often introduces it and can be dropped after common verbs: “I think (that) she is right.”", "A wh-clause (what, how, why, where, who) can also act as a noun. As object: “I don’t know why prices fell.” As SUBJECT: “What matters is practice.” Here what means the thing that.", "Use ‘The fact that …’ to turn a whole idea into a subject: “The fact that temperatures are rising shows a clear trend.” The main verb (shows) belongs to the fact, not to a plural inside the clause.", "A clause subject always takes a SINGULAR verb, even when it sounds plural: “What we need is more time.” (✗ are more time).", "Inside the clause, keep statement word order — subject before verb, with no question inversion and no do/does/did: ✓ “What matters is…” (✗ what does matter is), ✓ “I know where the station is.” (✗ where is the station)."] },
    ],
    quiz: [
      { q: "The number of students choosing online learning has increased significantly ___ it provides flexibility.", opts: ["despite", "because", "so that"], a: 1, ex: "A reason clause → because." },
      { q: "___ people travel during the summer, airfares tend to be more expensive.", opts: ["When", "Despite", "So that"], a: 0, ex: "A time clause → When." },
      { q: "He managed to complete the project ___ the tight deadline.", opts: ["although", "because", "despite"], a: 2, ex: "Despite + noun phrase (although needs a full clause)." },
      { q: "The company expanded rapidly ___ it could take advantage of new market opportunities.", opts: ["so that", "despite", "even though"], a: 0, ex: "Purpose → so that + clause." },
      { q: "___ she studied all night for the exam, she didn’t pass.", opts: ["Because", "Although", "So that"], a: 1, ex: "Contrast between effort and result → Although." },
      { q: "___ it was raining heavily, we continued the hike.", opts: ["Even though", "Because of", "As a result of"], a: 0, ex: "Even though + clause shows contrast." },
      { q: "Which sentence is correct?", opts: ["Children are addicted to smartphones, this has significant impacts on their mental health.", "Children are addicted to smartphones, and this has significant impacts on their mental health."], a: 1, ex: "Two independent clauses need a conjunction — a comma alone is a comma splice." },
      { q: "Which is a complete sentence?", opts: ["While self-driving cars are more reliable than human drivers.", "While self-driving cars are more reliable than human drivers, they can still make errors."], a: 1, ex: "A ‘while’ clause alone is a fragment — it needs an independent clause." },
      { q: "___ the researchers found surprising was that patients recovered faster than expected.", opts: ["What","That","It","Which"], a: 0, ex: "‘What’ (= the thing that) begins a wh-clause that acts as the subject of the sentence: What the researchers found surprising was… ‘That’, ‘It’, and ‘Which’ cannot open a subject clause here." },
      { q: "Economists cannot fully explain why ___ so sharply that year.", opts: ["prices fell","did prices fall","prices did fall","fell prices"], a: 0, ex: "Inside a wh-clause use statement word order (subject + verb), not question inversion or emphatic do: why prices fell. ‘did prices fall’ and ‘prices did fall’ are question/emphatic forms, and ‘fell prices’ has the wrong order." },
    ],
  },
  {
    id: 14, title: "Gerunds & Infinitives", tag: "-ing vs to + verb",
    learn: [
      { h: "Gerund as subject", b: ["When an -ing action starts a sentence, it acts as a single subject and takes a singular verb: “Reading widely improves vocabulary.” (not ‘improve’).", "The gerund names an activity, like a noun: “Cycling to work saves money and keeps you fit.”", "Even a long gerund phrase stays singular: “Taking regular breaks helps students concentrate.”", "Avoid the infinitive as the everyday subject — English prefers the gerund here: say “Learning a language takes time,” not ‘To learning…’."] },
      { h: "The first verb decides", b: ["The main verb chooses the form of the verb that follows it — you must learn which verb takes which.", "Gerund-takers: enjoy, avoid, admit, deny, suggest, recommend, consider, finish, keep, mind, practise, risk, miss, delay, imagine, postpone → “She suggested delaying the meeting.”", "Infinitive-takers: afford, agree, decide, hope, plan, promise, refuse, manage, offer, expect, want, learn, arrange, fail, tend → “They agreed to sign the contract.”", "Classic errors: ✗ ‘suggest to do’, ✗ ‘enjoy to do’ — write “suggest doing” and “enjoy doing.”"] },
      { h: "Both possible — same or changed meaning", b: ["After begin, start and continue the meaning is the same either way: “It started raining.” = “It started to rain.”", "stop + gerund = quit the action: “He stopped smoking.” (he no longer smokes); stop + to-infinitive = pause in order to do something: “He stopped to smoke.” (he paused for a cigarette).", "remember/forget + to-infinitive = a duty ahead: “Remember to lock the door.”; + gerund = a past memory: “I remember locking the door.”", "try + to-infinitive = attempt something hard: “I tried to open it.”; try + gerund = experiment with a solution: “Try turning it off and on.”", "regret + to-infinitive = bad news now: “We regret to inform you…”; + gerund = feel sorry about the past: “I regret saying that.”"] },
      { h: "After prepositions → gerund", b: ["Any verb straight after a preposition becomes a gerund: “interested in learning, good at writing, keen on travelling, tired of waiting.”", "The ‘to’ in look forward to and be used to is a preposition, so a gerund follows: “I look forward to hearing from you.” (✗ ‘to hear’).", "before and after take a gerund too: “Check the sources before quoting them.”", "Infinitive of purpose = ‘in order to’: “The council raised fares to reduce traffic.”; but for + -ing names a thing’s function: “This tool is for cutting metal.”"] },
    ],
    quiz: [
      { q: "The report recommended ___ investment in public transport to cut urban emissions.", opts: ["to increase","increasing","increase"], a: 1, ex: "‘Recommend’ is a gerund-taker: recommend doing. Never ‘recommend to do’." },
      { q: "After reviewing the data, the team decided ___ the trial until the following year.", opts: ["postponing","to postpone","postpone"], a: 1, ex: "‘Decide’ is an infinitive-taker: decide to do. A gerund (‘deciding postponing’) is wrong." },
      { q: "___ a wide range of sources strengthens the argument of an academic essay.", opts: ["To citing","Cite","Citing","Cites"], a: 2, ex: "An -ing action as the subject is a gerund and takes the singular verb ‘strengthens’; the infinitive is not used as an everyday subject." },
      { q: "Many economists are interested in ___ how interest rates influence consumer spending.", opts: ["to understand","understanding","understand"], a: 1, ex: "After the preposition ‘in’ the verb must be a gerund: interested in doing." },
      { q: "According to the graph, exports stopped ___ after 2011 and stayed flat for a decade.", opts: ["to grow","growing","grow"], a: 1, ex: "Stop + gerund = the action ceased (exports quit growing). Stop + to-infinitive would mean ‘paused in order to grow’, which makes no sense here." },
      { q: "Researchers look forward to ___ the full results at the conference next month.", opts: ["present","to present","presenting"], a: 2, ex: "In ‘look forward to’, the ‘to’ is a preposition, so a gerund follows: look forward to doing (✗ ‘to present’)." },
      { q: "Before submitting the paper, authors must remember ___ every quoted source.", opts: ["citing","to cite","cite"], a: 1, ex: "Remember + to-infinitive = a duty still ahead. Remember + gerund would mean recalling a past action, which does not fit an instruction." },
      { q: "The city introduced a congestion charge ___ the number of cars in the centre.", opts: ["for reducing","to reduce","for reduce"], a: 1, ex: "This is the infinitive of purpose (= in order to reduce). ‘For + -ing’ states a thing’s function, not the aim of an action or policy." },
    ],
  },
  {
    id: 15, title: "Reported Speech", tag: "say, tell & backshift",
    learn: [
      { h: "Tense backshift", b: ["After a past reporting verb (said, told, claimed), the present usually shifts back one step to the past: “The data is reliable” → She said the data was reliable.", "Past simple and present perfect both shift back to the past perfect: “Sales have risen” / “Sales rose” → He reported that sales had risen.", "Modals shift too: will→would, can→could, may→might, must→had to: “We can meet the target” → They said they could meet the target.", "General or scientific truths that are still true need not shift: “Water boils at 100°C” → The teacher said that water boils at 100°C."] },
      { h: "Pointer shifts", b: ["Pronouns move to fit the new speaker's viewpoint: “I need your help” → He said he needed my help.", "Time words move back: today→that day, tomorrow→the following day, yesterday→the day before: “I'll call you tomorrow” → She said she would call the following day.", "now→then when the moment is past: “I'm busy now” → He said he was busy then.", "Place and demonstratives shift: here→there, this→that: “Sign here on this line” → She told me to sign there on that line."] },
      { h: "say vs tell & reporting verbs", b: ["'tell' is followed straight by a person; 'say' is not: “She told me the news” (✗ said me the news); use say + that or say to someone.", "advise / warn / remind / ask / tell + someone + (not) to do: “The doctor advised him to rest.” “She warned us not to be late.” “He reminded me to bring my ID.”", "suggest and recommend take -ing or a that-clause, never 'to do': “They suggested meeting earlier.” “I recommend that you apply now.” (✗ suggested to meet)", "admit and deny take -ing; apologise takes for + -ing: “He admitted making a mistake.” “She apologised for arriving late.”", "promise / offer / refuse / agree take a to-infinitive: “They agreed to help” and “He refused to sign the form.”"] },
      { h: "Reported questions & requests", b: ["Reported questions use statement word order (subject before verb) with no inversion and no 'did': “Where is the station?” → He asked where the station was.", "Report yes/no questions with 'if' or 'whether': “Do you agree?” → She asked whether I agreed.", "Never keep the question mark in a reported question: it is now a statement.", "Report requests and commands with asked / told someone (not) to do: “Please wait” → He asked me to wait; “Don't touch it” → She told me not to touch it."] },
    ],
    quiz: [
      { q: "The researcher said that the results ___ consistent with earlier studies.", opts: ["are","were","have been"], a: 1, ex: "After a past reporting verb, present simple 'are' backshifts to past simple 'were'. Keeping 'are' fails to shift the tense." },
      { q: "The lecturer ___ the students that the deadline had been extended.", opts: ["said","told","told to"], a: 1, ex: "'tell' is followed directly by a person: told the students. 'say' cannot take a person object (✗ said the students), and 'told to' is wrong." },
      { q: "When she phoned, my colleague said that she ___ on the report at that moment.", opts: ["is working","was working","works"], a: 1, ex: "Present continuous backshifts to past continuous after a past reporting verb: ‘was working … at that moment’." },
      { q: "Last year, the spokesperson said that the company ___ cut its emissions the following year.", opts: ["will","would","will have"], a: 1, ex: "‘Will’ backshifts to ‘would’; the shifted time phrase ‘the following year’ requires the past frame." },
      { q: "The interviewer asked the candidate where ___ before joining the firm.", opts: ["had she worked","she had worked","did she work"], a: 1, ex: "Reported questions use statement word order (subject + verb): 'where she had worked', with no inversion and no auxiliary 'did'." },
      { q: "The questionnaire asked participants ___ they commuted to work by car.", opts: ["that","whether","what"], a: 1, ex: "Yes/no questions are reported with 'if' or 'whether'. 'that' introduces a statement, and 'what' changes the meaning." },
      { q: "In her lecture, the professor reminded students that the Earth ___ the Sun once a year.", opts: ["orbits","had orbited","is orbiting"], a: 0, ex: "A general, still-true scientific fact need not backshift, so present simple 'orbits' stays; past perfect 'had orbited' wrongly suggests it is finished." },
      { q: "The consultant recommended ___ the marketing budget before the product launch.", opts: ["to increase","increasing","increase"], a: 1, ex: "'recommend' (like 'suggest') is followed by -ing or a that-clause, never a to-infinitive: recommended increasing." },
    ],
  },
  {
    id: 16, title: "Linking & Signposting", tag: "however, therefore, despite…",
    learn: [
      { h: "Three grammatical families", b: ["A conjunction joins two clauses inside ONE sentence (but, so, because, although, while, whereas): “Sales fell, but profits rose.” Both halves have their own subject and verb.", "A sentence adverbial OPENS a new sentence and takes a comma (However, / Therefore, / Furthermore, / In addition, / As a result, / In contrast,): “Costs rose. However, profits stayed stable.”", "A preposition is followed by a NOUN or an -ing form, never a full clause (despite, in spite of, due to, because of, in addition to, as a result of): “Despite the rain, the match went ahead.” / “Despite feeling tired, she kept working.”", "Read the slot first: a full clause (subject + verb) needs a conjunction or adverbial; a noun or -ing phrase needs a preposition-type linker."] },
      { h: "Function groups", b: ["Addition — Furthermore, Moreover, In addition, In addition to: “The plan is costly. Moreover, it is slow.”", "Contrast / concession — However, Nevertheless, In contrast, whereas, although, even though, despite, in spite of: “Prices fell; however, demand stayed weak.”", "Cause — because (+ clause), due to / because of / as a result of (+ noun): “The delay was due to bad weather.”", "Result — so, therefore, as a result, consequently: “Demand dropped; therefore, prices fell.”", "Example & rephrasing — For example / For instance (illustration), In other words (restating): “Some skills are fading — for example, handwriting.”"] },
      { h: "Punctuation", b: ["A fronted (opening) adverbial takes a comma after it: “Therefore, the project was cancelled.”", "A comma alone cannot join two independent clauses (the comma-splice trap). Put a full stop or a semicolon before ‘however’: “Costs rose; however, profits held.” — not “Costs rose, however, profits held.”", "Mid-sentence, ‘however’ is fenced by commas but still does not join clauses: “Profits, however, held steady.”", "A fronted prepositional phrase also needs a comma: “Despite the setback, the team continued.”"] },
      { h: "Precision & overuse", b: ["One linker per idea — never stack two from the same family: ✗ “But however, …” → pick one: “However, …”", "Never put a full clause after a preposition-type linker: ✗ “Despite it was raining” → “Despite the rain, …” or “Although it was raining, …”", "‘because’ + clause vs ‘because of’ + noun: “because prices rose” but “because of higher prices”.", "Match register and vary your linkers: ‘Furthermore / Consequently’ suit formal essays, while ‘so / but’ are fine but lighter — don't repeat the same connector in every sentence."] },
    ],
    quiz: [
      { q: "___ the sharp rise in production costs, the company’s profits remained stable.", opts: ["Although","Despite","However","Because"], a: 1, ex: "A noun phrase (‘the sharp rise…’) follows, so the preposition-type linker ‘despite’ fits. ‘Although’ needs a full clause, ‘however’ opens a new sentence, and ‘because’ shows cause rather than concession." },
      { q: "The survey results were inconclusive. ___, further research is needed before any firm conclusions can be drawn.", opts: ["Therefore","However","Because of","In addition"], a: 0, ex: "A new sentence signalling a result uses the adverbial ‘Therefore,’ + comma. ‘However’ marks contrast, ‘because of’ needs a noun, and ‘in addition’ marks addition, not result." },
      { q: "The flight was delayed ___ the heavy fog over the airport.", opts: ["because","because of","so","although"], a: 1, ex: "‘because of’ is a preposition and takes a noun phrase (‘the heavy fog’). ‘because’ would need a full clause with its own verb, e.g. ‘because the fog was heavy’." },
      { q: "___ the government invested heavily in renewable energy, total emissions continued to rise.", opts: ["Despite","Although","Because of","However"], a: 1, ex: "A full clause (‘the government invested…’) follows, so use the conjunction ‘although’. ‘Despite’ and ‘because of’ need a noun, and ‘however’ cannot join two clauses inside one sentence." },
      { q: "Which sentence is punctuated correctly?", opts: ["Demand increased, however, supply stayed the same.","Demand increased; however, supply stayed the same.","Demand increased however, supply stayed the same.","Demand increased, however supply stayed the same."], a: 1, ex: "‘however’ is an adverbial, not a conjunction, so it cannot join two clauses with only commas (a comma splice). Use a semicolon (or full stop) before it: ‘…increased; however, …’." },
      { q: "Which sentence is correct?", opts: ["But however, the theory remains widely accepted.","Although the evidence is weak, the theory remains widely accepted.","Despite the evidence is weak, the theory remains widely accepted.","Because of the evidence is weak, the theory remains widely accepted."], a: 1, ex: "‘Although’ + a full clause is correct. Never stack linkers (‘But however’), and never follow a preposition-type linker (‘despite’ / ‘because of’) with a full clause." },
      { q: "Some traditional skills are gradually disappearing; ___, letter-writing by hand is now uncommon among young people.", opts: ["for example","in contrast","therefore","nevertheless"], a: 0, ex: "‘for example’ introduces an illustration of the previous idea. ‘in contrast’ and ‘nevertheless’ signal contrast, while ‘therefore’ signals a result." },
      { q: "The new medication reduced symptoms in most patients. ___, a small minority reported no improvement whatsoever.", opts: ["Nevertheless","Consequently","Furthermore","Therefore"], a: 0, ex: "The second sentence contradicts the first, so use the concession adverbial ‘Nevertheless’. ‘Consequently’ and ‘Therefore’ signal result, and ‘Furthermore’ signals addition." },
    ],
  },
  {
    id: 17, title: "Pronouns & Reference", tag: "it, they, this, one, such",
    learn: [
      { h: "Agreement basics", b: ["In formal writing a company or institution is treated as singular, so use it/its, not they. “The company increased its profits.”", "The government, the committee, the team and a bank all take singular it/its in academic English. “The government defended its policy.”", "Uncountable nouns such as research, information, evidence and advice take it. “The evidence is strong; it supports the theory.”", "Plural nouns take they/them/their. “Prices rose because they were affected by demand.”", "Check the noun's number and type before you choose the pronoun. “Data are limited, so they must be read with care.”"] },
      { h: "this/that/these/those for ideas", b: ["Use this/that to point back to a whole idea in the previous sentence, not only to one noun. “Sales fell sharply. This decline surprised managers.”", "Add a summary noun after this/that to keep the reference clear. “Many workers resigned. This trend continued for months.”", "Use these/those before a plural summary noun. “Costs and delays increased. These problems damaged the project.”", "that/those can mark distance or a contrast with earlier figures. “Those results differ from this year's.”", "A bare 'this' with no noun is often vague in academic writing, so a summary noun improves cohesion. “This finding…” is clearer than “This…”."] },
      { h: "Substitution tools", b: ["one/ones replaces a countable noun already mentioned: one is singular, ones is plural. “The old design failed, so engineers built a new one.”", "Use the former / the latter for the first and the second of two things. “Tea and coffee are popular; the former is calming, the latter is stimulating.”", "such + noun refers back to a type just described; note the pattern 'such a + adjective + noun + that'. “It was such a large sample that the results were reliable.”", "do so is a formal way to stand in for a whole action mentioned before. “Companies must cut waste, and many are trying to do so.”", "Substitution lets you avoid repeating the same words and keeps the writing smooth. “Old buses were replaced with electric ones.”"] },
      { h: "Clear reference", b: ["Avoid an ambiguous it/they that could point to two different nouns; repeat the noun if the reference is unclear. “The manager told the worker that the report was wrong.”", "Use there is/are to introduce something new, but it is to comment, usually with an adjective + that/to. “There is a problem.” vs “It is clear that costs rose.”", "there + be states existence, so never start such a sentence with it. “There are three reasons…” (not “It are…”).", "its (no apostrophe) is possessive, while it's means 'it is' or 'it has'. “The city improved its transport, and it's now faster.”", "Reread each pronoun and confirm exactly what it refers to before you submit your essay. “The results were strong; they justified the method.”"] },
    ],
    quiz: [
      { q: "The corporation performed well last year, and ___ share price rose sharply.", opts: ["their","its","it's"], a: 1, ex: "In formal English a corporation is singular, so use the possessive 'its'. 'It's' means 'it is', and 'their' would treat the company as plural." },
      { q: "The new research is promising, but ___ still needs to be tested on a larger group.", opts: ["they","it","them"], a: 1, ex: "'Research' is an uncountable noun, so it takes the singular pronoun 'it', never 'they' or 'them'." },
      { q: "House prices climbed every month for a year. ___ increase made it harder for young people to buy homes.", opts: ["This","These","It"], a: 0, ex: "'This' plus a summary noun ('increase') refers back to the whole idea in the previous sentence and keeps the writing cohesive; 'These' would need a plural noun." },
      { q: "The factory's old machines were slow, so the owners replaced them with faster ___.", opts: ["one","ones","it","them"], a: 1, ex: "'Machines' is plural and countable, so the substitute word is 'ones'; 'one' would refer to just a single machine." },
      { q: "The essay compares wind and solar power: the former is cheaper to build, while ___ produces energy more consistently.", opts: ["the latter","the last","latter","the later"], a: 0, ex: "'The former' means the first item (wind) and 'the latter' means the second (solar); 'the later' refers to time, not order." },
      { q: "The survey was based on ___ a small sample that its conclusions cannot be trusted.", opts: ["such","so","very","too"], a: 0, ex: "Use 'such + a + adjective + noun + that' to show a result; 'so' would have to come directly before the adjective alone ('so small a sample')." },
      { q: "The company pledged to lower its prices, yet it has so far failed to ___.", opts: ["do so","do it so","so do","make so"], a: 0, ex: "'Do so' is a formal way to stand in for a whole action already mentioned ('lower its prices'); the other forms are ungrammatical." },
      { q: "Which sentence is correct?", opts: ["It are many countries that face this issue.","There are many countries that face this issue.","There is many countries that face this issue."], a: 1, ex: "Use 'there + are' to introduce a new plural subject ('countries'); 'there is' breaks plural agreement and 'it are' is not English." },
    ],
  },
  {
    id: 18, title: "Noun Phrases & Adjective Order", tag: "Building longer noun phrases",
    learn: [
      { h: "Anatomy of a noun phrase", b: ["A noun phrase is built around a head noun in a fixed shape: determiner + (adverb) + adjective(s) + head noun + prepositional phrase, as in “a significant increase in oil production”.", "The determiner comes first and fixes the reference (a, the, this, some, each): “the results”, “a tendency”, “this pattern”.", "An adverb can grade the adjective right before it: in “a remarkably large deficit”, “remarkably” modifies “large”, not the noun.", "The prepositional phrase after the head noun usually carries the key detail: “a decline in birth rates”, “the impact of tourism”.", "In academic writing most meaning sits inside long noun phrases, so read to the end of the phrase before deciding what the sentence is really about."] },
      { h: "Adjective order", b: ["When adjectives stack before a noun, English follows a fixed order: opinion → size → age → shape → colour → origin → material → purpose, giving “a beautiful small wooden box”.", "Opinion adjectives (nice, useful, beautiful) always come first; factual ones follow: “a useful little tool”, not “a little useful tool”.", "Material and purpose sit closest to the noun: “an old stone wall”, “a plastic shopping bag”.", "Use commas only between coordinate adjectives of the same type — ones you could reverse or join with “and”: “a cold, wet morning” but “a small wooden box” (no comma).", "Quick test: if you can add “and” or swap the pair naturally, use a comma; if not, leave it out."] },
      { h: "Noun+noun & of-phrases", b: ["Two nouns can combine, with the first acting like an adjective and staying singular: “government policy”, “city centre”, “oil production”.", "Noun+noun compounds are compact and common in reports and headlines: “traffic congestion”, “energy consumption”.", "Use “of” for possession, a part, or a specific measured result: “the results of the survey”, “the roof of the building”.", "Prefer “of” when the idea is a defined thing with “the”: “the aims of the study” sounds more formal than “the study aims”.", "Some pairings only work one way and the meaning changes: “a cup of coffee” (contents) versus “a coffee cup” (a type of cup)."] },
      { h: "Nominalisation for academic style", b: ["Nominalisation turns a verb or adjective into a noun so you pack more into fewer clauses: grow → “growth in”, reduce → “a reduction in”, improve → “an improvement in”.", "Instead of “Prices grew and this worried people”, write “The growth in prices caused concern” — one noun phrase does the work of a whole clause.", "Watch the preposition: it is “increase in”, “growth in”, “a reduction in” — never “increase of” for a rise in amount.", "Other useful patterns: “a tendency to” + base verb (“a tendency to overspend”), “a decline in”, “the introduction of”.", "Nominalisation makes writing denser and more formal, which suits IELTS Task 1 and Task 2 — but overusing it makes sentences hard to read."] },
    ],
    quiz: [
      { q: "Which phrase follows the normal adjective order?", opts: ["a wooden small beautiful box","a beautiful small wooden box","a small beautiful wooden box"], a: 1, ex: "Adjectives follow opinion → size → age → shape → colour → origin → material → purpose. So opinion (beautiful) comes before size (small), and material (wooden) sits last: “a beautiful small wooden box”." },
      { q: "The chart shows a significant increase ___ car ownership between 1990 and 2010.", opts: ["of","in","on"], a: 1, ex: "A rise in an amount takes “increase in”: “an increase in car ownership”. “Increase of” is used only with an exact figure (“an increase of 5%”), and “increase on” is wrong here." },
      { q: "Many large cities are trying to reduce ___ during rush hour.", opts: ["traffic congestion","congestion of traffic","traffic's congestion"], a: 0, ex: "Two nouns combine, with the first acting like an adjective and staying singular: “traffic congestion”. The “of” version and the possessive “’s” are unnatural here." },
      { q: "The final section of the report discussed ___ in detail.", opts: ["the results of the survey","the survey of the results","the result's survey"], a: 0, ex: "Use “of” for a specific, defined result: “the results of the survey”. Reversing it to “the survey of the results” changes the meaning and is wrong here." },
      { q: "The museum's main hall contained an ___ statue from the classical period.", opts: ["ancient Greek stone","Greek ancient stone","stone ancient Greek"], a: 0, ex: "Adjective order runs age → origin → material: “ancient” (age) → “Greek” (origin) → “stone” (material), giving “an ancient Greek stone statue”." },
      { q: "The line graph shows a steady ___ the number of international students.", opts: ["growth in","growth of","growing in"], a: 0, ex: "A rise is described with “a growth in” + noun: “a growth in the number of students”. The preposition is “in”, not “of”, and we need the noun “growth”, not the -ing form." },
      { q: "Research suggests that consumers have a strong tendency ___ overspend during sales.", opts: ["to","of","for"], a: 0, ex: "The pattern is “a tendency to” + base verb: “a tendency to overspend”. It is not “tendency of” or “tendency for” when a verb follows." },
      { q: "Which version is best for a formal academic essay?", opts: ["The city reduced traffic, and this improved air quality.","The reduction in traffic led to an improvement in air quality.","The city reduce traffic and air quality improve."], a: 1, ex: "The formal version nominalises the verbs: “reduce” → “a reduction in”, “improve” → “an improvement in”. Two clauses collapse into compact noun phrases, and both take “in”." },
    ],
  },
  {
    id: 19, title: "Questions & Question Tags", tag: "Direct, indirect & tags",
    learn: [
      { h: "Direct questions", b: ["In yes-no questions, put the auxiliary before the subject (inversion): “Is the trend rising?”, “Have the numbers changed?”", "When will, can, be or have is already there, just swap it with the subject: “Will the figure double by 2030?”, “Can we see the data?”", "In the simple present and past there is no auxiliary, so add do/does/did + base verb: “Does the chart show growth?”, “Did sales fall last year?”", "Wh-questions keep the same inversion after the question word: “Where do the figures come from?”, “How much did prices rise?”", "Mark the tense only once: say “Did it increase?”, never ✗ “Did it increased?”"] },
      { h: "Indirect (embedded) questions", b: ["After openers like “Could you tell me…”, “I wonder…” or “Do you know…”, the embedded question uses statement word order — subject before verb: “Could you tell me where the station is?”", "There is no inversion and no do/does/did inside the embedded part: “I don't know why the results vary.”, not ✗ “why do the results vary”.", "For yes-no questions, join the two clauses with if or whether: “Do you know whether the library is open?”", "Embedded questions sound more polite and formal — useful in the speaking test: “I wonder how long the experiment took.”", "Common error: ✗ “Could you tell me where is the station?” — the verb must come after the subject: “…where the station is?”"] },
      { h: "Question tags", b: ["A positive statement takes a negative tag, and a negative statement takes a positive tag: “The graph is clear, isn't it?”, “You didn't save the file, did you?”", "The tag copies the auxiliary in the statement, or uses do/does/did when there is none: “They don't agree, do they?”, “She has finished, hasn't she?”", "Learn the specials: “I'm right, aren't I?” · “Let's start, shall we?” · “Close the door, will you?”", "With there is / there are, keep there in the tag: “There is a mistake, isn't there?”", "Match the tense and auxiliary exactly: “You called him, didn't you?”, not ✗ “…haven't you?”"] },
      { h: "Subject vs object questions", b: ["When who/what is the subject (the doer), use no do-support and keep statement order: “Who called you?”, “What caused the delay?”", "When who/what is the object, use normal do-support: “Who did you call?”, “What did the study show?”", "Compare the pair: subject question “Who wrote it?” has no do; object question “Who did they blame?” does.", "In subject questions the verb agrees with a singular idea: “Who wants coffee?”, not ✗ “Who want coffee?”", "Common error: adding do to a subject question: ✗ “Who did call you?” → “Who called you?”"] },
    ],
    quiz: [
      { q: "___ the two graphs show exactly the same pattern of growth?", opts: ["Do","Does","Are"], a: 0, ex: "The subject ‘the two graphs’ is plural and ‘show’ is the main verb, so the simple present needs do-support: ‘Do … show?’." },
      { q: "I'd like to know why the figures ___ so dramatically after 2020.", opts: ["fell","did the figures fall","fall"], a: 0, ex: "Inside an embedded question you keep statement word order with no do-support: ‘why the figures fell’, not the inverted ‘did the figures fall’." },
      { q: "In the speaking test the examiner asked ___ I had ever taken the exam before.", opts: ["whether","that","what"], a: 0, ex: "An embedded yes-no question is joined with if or whether. ‘that’ and ‘what’ do not fit a yes/no enquiry here." },
      { q: "The bar chart clearly illustrates the population growth, ___?", opts: ["doesn't it","isn't it","won't it","don't it"], a: 0, ex: "The statement is present simple (‘illustrates’), so the tag uses do: ‘doesn't it?’. ‘isn't it’ wrongly assumes the verb ‘be’." },
      { q: "I'm reading this pie chart correctly, ___?", opts: ["aren't I","amn't I","isn't it","don't I"], a: 0, ex: "The fixed tag for a positive ‘I'm …’ statement is the special form ‘aren't I?’; ‘amn't I’ is not standard English." },
      { q: "Which country ___ the highest literacy rate, according to the table?", opts: ["had","did have","did it have"], a: 0, ex: "‘Which country’ is the subject of the question, so there is no do-support: ‘Which country had…?’, not ‘did have’." },
      { q: "You've already seen the updated statistics for last year, ___?", opts: ["haven't you","didn't you","don't you","aren't you"], a: 0, ex: "The statement is present perfect (‘You've seen’), so the tag copies the auxiliary ‘have’: ‘haven't you?’." },
      { q: "There's still a clear difference between the two groups, ___?", opts: ["isn't there","isn't it","aren't there","doesn't it"], a: 0, ex: "With a ‘There is …’ statement the tag keeps ‘there’ and reverses the polarity: ‘isn't there?’." },
    ],
  },
  {
    id: 20, title: "Punctuation & Parallelism", tag: "Commas, semicolons & balanced lists",
    learn: [
      { h: "S1 — Commas that matter", b: ["Put a comma before a FANBOYS conjunction (for, and, nor, but, or, yet, so) when it joins two independent clauses: “The test was hard, but everyone passed.”", "Add a comma after a fronted subordinate clause: “Because the data was limited, the writer stayed cautious.” Drop it when the main clause comes first: “The writer stayed cautious because the data was limited.”", "Use a comma after a linking adverbial that opens a sentence: “In addition, the survey covered rural areas.”", "Separate three or more list items with commas: “The diet cut sugar, salt, and fat.”", "The comma splice is the key error — two independent clauses joined by only a comma: ✗ “The results were clear, the team celebrated.” Fix it with a semicolon, a full stop, or a comma + FANBOYS."] },
      { h: "S2 — Semicolon & colon", b: ["Use a semicolon between two closely related independent clauses: “Exports rose; imports fell.”", "Use a semicolon before a linking adverb such as 'however' or 'therefore', with a comma after it: “The plan was cheap; however, it was slow.”", "Use a colon to introduce a list, but only after a complete clause: “The chart shows three trends: growth, decline, and recovery.”", "Use a colon to introduce an explanation: “The reason was simple: demand had collapsed.”", "Never place a colon after an incomplete clause: ✗ “The factors include: cost and time.” Keep the clause whole first."] },
      { h: "S3 — Small marks, big penalties", b: ["“Its” (no apostrophe) shows possession: “The city raised its budget.” “It’s” means 'it is' or 'it has': “It’s a common mistake.”", "Capitalise the first word of every sentence and all proper nouns: “The study, led by Oxford researchers, took ten years.”", "Avoid exclamation marks in academic writing — they sound informal: ✗ “The rise was huge!” → “The rise was significant.”", "Do not use capitals for emphasis: ✗ “This is VERY important.” → “This is very important.”"] },
      { h: "S4 — Parallel structure", b: ["Items in a list must share one grammatical form: “The course builds reading, writing, and listening.”", "Keep comparisons parallel: “Cycling is cheaper than driving,” not ✗ “cheaper than to drive.”", "Paired connectors must join equal forms: “both fast and cheap”, “either online or in person”.", "'Not only … but also' balances the same structure: “not only cheaper but also faster,” not ✗ “not only cheaper but also it saves time.”", "'Neither … nor' follows the same rule: “The plan was neither clear nor realistic.”"] },
    ],
    quiz: [
      { q: "Which sentence is punctuated correctly?", opts: ["The graph rose sharply, it then levelled off.","The graph rose sharply; it then levelled off.","The graph rose sharply it then levelled off."], a: 1, ex: "Two independent clauses cannot be joined by a comma alone — that is a comma splice. Use a semicolon, a full stop, or a comma + FANBOYS." },
      { q: "Choose the correctly punctuated version.", opts: ["Although the sample was small the results were still significant.","Although the sample was small, the results were still significant.","Although, the sample was small the results were still significant."], a: 1, ex: "A fronted subordinate clause ('Although…') is followed by a comma, and no comma goes after the subordinator itself." },
      { q: "Which sentence places the comma correctly?", opts: ["The study was small, but the findings were clear.","The study was small but, the findings were clear.","The study was small, but, the findings were clear."], a: 0, ex: "When a FANBOYS conjunction joins two independent clauses, the comma comes before the conjunction, never after it." },
      { q: "Which sentence is correct?", opts: ["The plan looked simple, however, it failed in practice.","The plan looked simple; however, it failed in practice.","The plan looked simple however it failed in practice."], a: 1, ex: "'However' is a linking adverb, not a conjunction. Use a semicolon before it and a comma after it when it joins two clauses; a comma alone is a splice." },
      { q: "Which sentence uses the colon correctly?", opts: ["The report examines three factors: cost, quality, and speed.","The report examines three factors; cost, quality, and speed.","The report examines: three factors, cost, quality, and speed."], a: 0, ex: "A colon introduces a list only after a complete independent clause. 'The report examines three factors' is complete, so the colon fits." },
      { q: "Which sentence is correct?", opts: ["The device is popular because its cheap and reliable.","The device is popular because it's cheap and reliable.","The device is popular because its' cheap and reliable."], a: 1, ex: "'It's' is short for 'it is'/'it has'; 'its' (no apostrophe) shows possession. Here 'it's cheap' means 'it is cheap'." },
      { q: "The course develops three skills: reading, writing, and ___ .", opts: ["listening","to listen","listen","the ability to listen"], a: 0, ex: "Items in a list must share one grammatical form. To match the gerunds 'reading' and 'writing', use 'listening'." },
      { q: "Choose the parallel version.", opts: ["The app is not only cheap but also it saves time.","The app is not only cheap but also time-saving.","The app is not only cheap but also saves time."], a: 1, ex: "'Not only … but also' must join equal forms. Pair the adjective 'cheap' with another adjective, 'time-saving', not with a clause or a verb phrase." },
    ],
  },
  {
    id: 21, title: "Advanced Structures", tag: "so/such, inversion, causatives",
    learn: [
      { h: "Emphasis with so/such", b: ["Use so before an adjective or adverb, then that + result: “The results were so consistent that no one questioned them.”", "Use such before a noun phrase — such + (a/an) + (adjective) + noun: “It was such a dramatic rise that analysts rechecked the figures.”", "With uncountable or plural nouns, drop the article: “There was such strong demand that stocks ran out.”", "Before much/many/little/few + noun, use so, not such: “There was so much interest that the venue had to be changed.”", "The that-clause is optional, but it is what makes the emphasis sound academic: keep so for qualities, such for things."] },
      { h: "Inversion for emphasis", b: ["Start with a negative adverbial, then invert to auxiliary + subject + verb: “Not only did prices fall, but demand also rose.”", "The same pattern follows Rarely, Seldom, Never before, Hardly and Only then: “Rarely have researchers seen such a shift.”", "Under no circumstances signals a strong ban: “Under no circumstances should the sample be reused.”", "Conditional inversion replaces if: “Had the government acted sooner, the crisis would have eased.” = If the government had acted…", "Also “Were this to happen, output would collapse.” and “Should you need help, contact the tutor.” — a formal register, so use it sparingly."] },
      { h: "Causatives", b: ["have/get something done = arrange for someone else to do it: “The company had the bridge inspected.”", "make + somebody + bare infinitive (force) and let + somebody + bare infinitive (allow): “The teacher made the class rewrite it; they let visitors take photos.”", "get + somebody + to-infinitive (persuade): “We got a specialist to review the data.”", "Contrast with the passive: “have sth done” stresses that you arranged the service, not merely that it happened to the object.", "Watch the participle: it is “I had my car repaired”, never “I had my car repair”."] },
      { h: "The subjunctive", b: ["After suggest, recommend, insist, demand + that, use the base verb for every subject: “The panel recommended that the policy be revised.”", "The third person takes no -s: “The report insists that she take responsibility.” (not takes)", "After It is essential/vital/important that, also use the base verb: “It is essential that every student take the test.”", "The negative uses not + base, with no auxiliary: “They demanded that he not attend.”", "This is formal; in casual English many speakers add should (“…that she should take…”), so save the bare subjunctive for academic writing."] },
    ],
    quiz: [
      { q: "In the report, the upward trend was ___ steady that forecasters barely adjusted their models.", opts: ["such","so","very","too"], a: 1, ex: "Before an adjective (steady) use ‘so … that’ to introduce a result. ‘such’ needs a noun, and ‘very/too’ cannot lead into a that-result clause." },
      { q: "The survey revealed ___ a striking gap between the two groups that it made national headlines.", opts: ["so","such","very","too"], a: 1, ex: "‘a striking gap’ is a noun phrase, so use ‘such a striking gap that…’. ‘so’ would have to sit directly before a bare adjective, not before ‘a’." },
      { q: "Under no circumstances ___ be shared with third parties before the study is published.", opts: ["the raw data should","should the raw data","the raw data should not"], a: 1, ex: "A fronted negative adverbial such as ‘Under no circumstances’ forces inversion: auxiliary + subject → ‘should the raw data’. Do not add a second ‘not’." },
      { q: "Rarely ___ a dataset as complete as this one in long-term field research.", opts: ["scientists find","do scientists find","scientists do find"], a: 1, ex: "‘Rarely’ at the start triggers inversion: auxiliary + subject + verb → ‘do scientists find’. Without the auxiliary the clause stays uninverted and is wrong." },
      { q: "___ the authorities intervened earlier, the shortage might have been avoided altogether.", opts: ["If","Had","Should","Would"], a: 1, ex: "This is a third-conditional (past, unreal) idea. Inversion with ‘Had’ replaces ‘If … had’: ‘Had the authorities intervened…’. ‘Should’ would signal a future possibility, not a past one." },
      { q: "Before releasing the paper, the team had the calculations ___ by an independent statistician.", opts: ["check","checked","to check","checking"], a: 1, ex: "‘have something done’ takes a past participle: ‘had the calculations checked’. The subject arranges the service while someone else does the checking." },
      { q: "The professor insisted that the deadline ___ extended for the whole class.", opts: ["be","to be","being","been"], a: 0, ex: "After ‘insist that’, use the base-form subjunctive — here the passive ‘be extended’; ‘to be/being/been’ are all wrong." },
      { q: "Which sentence is correct?", opts: ["Not only he was late for the seminar, but he also forgot his notes.","Not only was he late for the seminar, but he also forgot his notes.","Not only he was late for the seminar, but also he forgot his notes."], a: 1, ex: "After a fronted ‘Not only’, invert the auxiliary and subject: ‘Not only was he late…’. Leaving ‘he was’ uninverted is the classic band-6 error." },
    ],
  },
];
