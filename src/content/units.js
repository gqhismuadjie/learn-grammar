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
    ],
  },
];
