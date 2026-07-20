import { useState, useEffect } from "react";
import {
  ChevronLeft, BookOpen, PenLine, Check, X, RotateCcw, Trophy, Clock,
  Loader2, Lightbulb, ArrowRight, AlertTriangle, Sparkles, History, Play
} from "lucide-react";

// ---------- Design tokens (royal blue + red accent) ----------
const C = {
  blue: "#2338E7",
  blueDark: "#1826B8",
  blueWash: "#EBEDFF",
  red: "#E82D3E",
  redWash: "#FDECEE",
  ink: "#131530",
  sub: "#5B5F7E",
  paper: "#F3F4FA",
  card: "#FFFFFF",
  line: "#E2E4F0",
  green: "#0E9F5B",
  greenWash: "#E7F6EE",
  amber: "#E8930C",
  amberWash: "#FCF3E3",
};

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
`;

const display = { fontFamily: "'Baloo 2', system-ui, sans-serif" };
const body = { fontFamily: "'Inter', system-ui, sans-serif" };

// ---------- Grammar content: 13 IELTS units ----------
// Each unit pairs concise rules with a targeted drill; every drill answer has a worked explanation.
const UNITS = [
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

// ---------- Writing Lab ----------
const WRITING_PROMPTS = [
  { id: "transport", title: "Public transport", text: "Some people believe that the government should invest in public transport to reduce traffic congestion. To what extent do you agree or disagree?" },
  { id: "online", title: "Online learning", text: "Some people think that online learning will eventually replace traditional classrooms. Do the advantages of this development outweigh the disadvantages?" },
  { id: "environment", title: "Environment", text: "Some people believe that individual actions make little difference to the environment, and that only governments and large companies can bring real change. To what extent do you agree or disagree?" },
  { id: "work", title: "Working hours", text: "In many countries, people are spending more and more hours at work. Why is this happening? What effects does this trend have on individuals and society?" },
];

const CRIT = [
  ["taskResponse", "Task Response"],
  ["coherence", "Coherence & Cohesion"],
  ["lexical", "Lexical Resource"],
  ["grammar", "Grammatical Range & Accuracy"],
];

// ---------- Persistence (saved between sessions via artifact storage) ----------
const K_PROG = "igr-progress";
const K_WRIT = "igr-writing";
const store = {
  async get(key) {
    try {
      if (typeof window === "undefined" || !window.storage) return null;
      const r = await window.storage.get(key);
      return r && r.value ? JSON.parse(r.value) : null;
    } catch (e) { return null; }
  },
  async set(key, val) {
    try {
      if (typeof window === "undefined" || !window.storage) return;
      await window.storage.set(key, JSON.stringify(val));
    } catch (e) { /* storage unavailable — keep in memory only */ }
  },
};

// ---------- Helpers ----------
function countWords(t) { return t.trim() ? t.trim().split(/\s+/).filter(Boolean).length : 0; }
function fmtTime(s) { const m = Math.floor(s / 60); const ss = s % 60; return `${m}:${ss < 10 ? "0" : ""}${ss}`; }
function bandStr(b) { return typeof b === "number" ? b.toFixed(1) : "–"; }

function buildScoringPrompt(promptText, essay, words, lang) {
  return `You are a certified IELTS Writing examiner. Assess the IELTS Writing Task 2 essay below using the official public band descriptors for Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Score each criterion in 0.5 steps between 4.0 and 9.0. Be realistically calibrated: a typical B2 learner scores 5.5-6.5; reserve 7.5+ for genuinely strong writing. If the essay is under 250 words, penalize Task Response. If the text is off-topic or not an essay, still return the JSON with low bands and say why in the comments. ${lang === "id" ? 'Write every "comment", every "strengths" and "improvements" item, and every "rule" in Bahasa Indonesia; keep "original" and "fixed" in English because they quote the essay.' : "Write all comments in English."}

ESSAY QUESTION:
${promptText}

CANDIDATE ESSAY (${words} words):
${essay}

Respond with ONLY a valid JSON object. No markdown, no backticks, no text before or after. Use exactly this schema:
{"taskResponse":{"band":6.0,"comment":"max 25 words"},"coherence":{"band":6.0,"comment":"max 25 words"},"lexical":{"band":6.0,"comment":"max 25 words"},"grammar":{"band":6.0,"comment":"max 25 words"},"overall":6.0,"strengths":["up to 3 items, each under 15 words"],"improvements":["up to 3 items, each under 15 words"],"errors":[{"original":"short exact phrase from the essay","fixed":"corrected phrase","rule":"short rule name","unit":10}]}

For "errors", list up to 4 of the most important language mistakes. "unit" maps each error to the most relevant unit of the learner's grammar course: 1 Articles, 2 Nouns/Quantifiers, 3 Prepositions, 4 Comparing, 5 Subject-Verb Agreement, 6 Past Tenses, 7 Present Tenses, 8 Future Tenses, 9 Passive Voice, 10 Conditionals, 11 Modals, 12 Relative Clauses, 13 Complex Sentences. Use null if no unit fits. "overall" is the average of the four bands rounded to the nearest 0.5.`;
}

async function scoreEssay(promptText, essay, lang) {
  const words = countWords(essay);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: buildScoringPrompt(promptText, essay, words, lang) }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  const clean = text.replace(/```json|```/g, "").trim();
  const s = clean.indexOf("{"); const e = clean.lastIndexOf("}");
  if (s < 0 || e < 0) throw new Error("Unexpected response");
  const j = JSON.parse(clean.slice(s, e + 1));
  if (typeof j.overall !== "number") {
    const bs = CRIT.map(([k]) => j[k] && j[k].band).filter(n => typeof n === "number");
    j.overall = bs.length ? Math.round((bs.reduce((a, b) => a + b, 0) / bs.length) * 2) / 2 : null;
  }
  return j;
}

// ---------- Bahasa Indonesia layer ----------
const K_LANG = "igr-lang";

const TAG_ID = {
  1: "a / an / the / Ø (tanpa artikel)",
  2: "Kata benda terhitung, tak terhitung & kuantifier",
  3: "Preposisi pasangan & frasanya",
  4: "Perbandingan & superlatif",
  5: "Kesesuaian subjek–kata kerja",
  6: "Simple, continuous, perfect (lampau)",
  7: "Simple, continuous, perfect (kini)",
  8: "will, going to & bentuk perfect",
  9: "be + V3 di semua tense",
  10: "Tipe 1, 2, 3 & campuran",
  11: "Kemampuan, kemungkinan, keharusan",
  12: "who, which, that, whose…",
  13: "Klausa & kata hubung",
};

// One Indonesian summary per Learn section (same order as the sections).
const LEARN_ID = {
  1: [
    "Pakai a/an untuk benda tunggal terhitung yang belum spesifik atau baru pertama kali disebut.",
    "Pakai the untuk sesuatu yang spesifik, sudah disebut, satu-satunya, atau bentuk superlatif.",
    "Tanpa artikel (Ø) untuk kata benda jamak/tak terhitung bermakna umum dan kebanyakan nama diri.",
  ],
  2: [
    "Kata benda tak terhitung (information, advice, research…) tidak punya bentuk jamak, tidak memakai a/an, dan kata kerjanya tunggal; ukur dengan “a piece of…”.",
    "some untuk kalimat positif, tawaran, dan permintaan; any untuk kalimat negatif dan pertanyaan.",
    "many/a few untuk terhitung, much/a little untuk tak terhitung; a lot of bisa keduanya. few/little = hampir tidak ada; a few/a little = ada beberapa, cukup.",
  ],
  3: [
    "Banyak kata kerja punya preposisi pasangan tetap: depend on, wait for, deal with — hafalkan sebagai satu paket.",
    "Kata sifat juga punya pasangan: interested in, responsible for, capable of, satisfied with.",
    "Kata benda pun begitu: increase in, impact on, demand for, reason for.",
    "Kalau ragu, cek kamus kolokasi untuk melihat preposisi yang lazim mengikuti sebuah kata.",
  ],
  4: [
    "Komparatif: kata sifat pendek + -er, kata sifat panjang pakai more, lalu “than”; jangan digandakan (✗ more cheaper).",
    "Superlatif: the + -est / the most untuk tiga hal atau lebih; “the” hilang setelah kata milik (our best package).",
    "Perkuat dengan slightly/far/significantly + komparatif atau by far + superlatif; pola “the more…, the more…” menunjukkan perubahan.",
  ],
  5: [
    "Subjek tunggal → kata kerja tunggal; subjek jamak → jamak. Dengan or/nor, kata kerja mengikuti subjek terdekat.",
    "everyone/each/every → tunggal; few/many/several → jamak; some/all/none mengikuti kata benda setelahnya. “The number of” tunggal, “a number of” jamak.",
    "There is/are mengikuti subjek di belakangnya; judul, negara, jumlah uang, dan mata pelajaran seperti mathematics dihitung tunggal.",
  ],
  6: [
    "Past simple untuk aksi selesai dan urutan kejadian di masa lampau.",
    "used to/would untuk kebiasaan lampau; hanya used to yang bisa dipakai untuk keadaan (state).",
    "Past continuous untuk aksi yang sedang berlangsung di satu titik lampau, sering “dipotong” oleh past simple.",
    "Past perfect (had + V3) untuk kejadian yang lebih dulu dari kejadian lampau lain.",
    "Past perfect continuous menekankan durasi sampai satu titik di masa lampau.",
  ],
  7: [
    "Present simple untuk rutinitas, fakta umum, dan jadwal.",
    "Present continuous untuk situasi sementara, yang sedang terjadi, dan tren; kata kerja keadaan (know, want…) biasanya tidak memakai bentuk ini.",
    "Present perfect menghubungkan lampau dengan sekarang (for/since, ever, yet); kalau waktunya disebut jelas, pakai past simple.",
    "Present perfect continuous menekankan durasi/aktivitasnya; bentuk simple menekankan hasil atau jumlah.",
  ],
  8: [
    "will untuk keputusan spontan, janji, dan prediksi berdasar opini.",
    "going to untuk rencana yang sudah ada dan prediksi dari bukti; present continuous untuk janji temu pasti, present simple untuk jadwal.",
    "Future continuous (will be + V-ing) untuk aksi yang sedang berlangsung di satu waktu di masa depan.",
    "Future perfect (will have + V3) untuk yang selesai sebelum satu titik di masa depan (by / by the time).",
    "Future perfect continuous untuk durasi sampai satu titik di masa depan.",
  ],
  9: [
    "Bentuk pasif = be + V3, dan “be”-nya berubah mengikuti tense (is discussed, was discussed, has been discussed…).",
    "Pakai pasif saat objek lebih penting daripada pelaku, pelakunya tak diketahui, atau untuk nada akademik yang formal.",
  ],
  10: [
    "Tipe 1 (nyata & mungkin): If + present, will.",
    "Tipe 2 (tidak nyata sekarang): If + past simple, would; dengan “be” pakai were.",
    "Tipe 3 (tidak nyata di masa lampau): If + past perfect, would have + V3.",
    "Campuran: syarat lampau, hasil sekarang — If + past perfect, would + kata kerja dasar.",
  ],
  11: [
    "can/could untuk kemampuan; be able to saat “can” tidak bisa dipakai; may/might/could untuk kemungkinan yang tidak pasti.",
    "could/might have + V3 = kemungkinan lampau; must have = yakin terjadi; can’t have = yakin tidak terjadi.",
    "must/have to untuk keharusan (lampau: had to); should have + V3 untuk penyesalan; had better memberi peringatan.",
    "Modals mengatur kekuatan opini: “could lead to” terdengar lebih berimbang daripada “will lead to”.",
  ],
  12: [
    "Klausa defining memberi info penting, tanpa koma; who/which/that bisa dihilangkan kalau berperan sebagai objek.",
    "Klausa non-defining memberi info tambahan di antara koma; jangan pakai “that” dan jangan hilangkan kata gantinya.",
    "whose = kepemilikan, where = tempat, when = waktu.",
  ],
  13: [
    "Klausa independen bisa berdiri sendiri; klausa dependen tidak. Hindari comma splice dan kalimat fragmen.",
    "Sebab-akibat: because/since/as + klausa; because of/due to + kata benda; so menunjukkan akibat.",
    "Kontras: although/even though + klausa; despite/in spite of + kata benda.",
    "Tujuan: so that + klausa, in order to + kata kerja; klausa waktu: when, while, before, after, until, as soon as.",
    "Untuk band 7 tidak perlu kalimat super panjang — variasi yang akurat lebih penting.",
  ],
};

// Indonesian explanations for the core-drill questions, keyed "unitId-questionIndex".
const EX_ID = {
  "1-0": "“The number of…” merujuk jumlah yang spesifik, jadi pakai “the” (dan kata kerja tunggal).",
  "1-1": "Baru pertama kali disebut, satu dari banyak lini produk → a.",
  "1-2": "Kata benda jamak yang bermakna umum tidak memakai artikel.",
  "1-3": "Superlatif selalu memakai “the”: the most popular.",
  "1-4": "Satu kenaikan yang belum spesifik, baru diperkenalkan → a.",
  "1-5": "Satu periode (tidak ditentukan yang mana) sepanjang itu → a three-year period.",
  "1-6": "“A significant decrease” baru pertama kali disebut → a.",
  "1-7": "Kebanyakan nama kota dan negara adalah nama diri, tanpa artikel.",
  "2-0": "“Information” tak terhitung → little (“few” untuk kata benda terhitung).",
  "2-1": "“Ideas” terhitung dan kalimatnya positif → a few.",
  "2-2": "“Advice” tak terhitung — ukur dengan “a piece of advice”.",
  "2-3": "“Experience” (pengalaman/keahlian) tak terhitung → a lot of.",
  "2-4": "“Furniture” tak terhitung → some (many / a few butuh kata benda terhitung).",
  "2-5": "Kalimat negatif + “time” yang tak terhitung → much.",
  "2-6": "“Research” tak terhitung → a lot of (tidak pernah “many researches”).",
  "2-7": "“Evidence” tak terhitung: a lot of evidence, dengan kata kerja tunggal.",
  "3-0": "Interested in — kata sifat + in.",
  "3-1": "Concentrate / rely / depend / insist on.",
  "3-2": "Responsible for — seperti reason for, demand for.",
  "3-3": "Shout / yell / point at seseorang.",
  "3-4": "Prepare / apply / wait / hope for.",
  "3-5": "Capable of + -ing.",
  "3-6": "A rise / increase / decrease in sesuatu.",
  "3-7": "An impact / effect / influence on sesuatu.",
  "4-0": "Kata sifat panjang → more + kata sifat + than.",
  "4-1": "Kata sifat pendek → -er + than.",
  "4-2": "Jangan “more cheaper” — cheap itu pendek, cukup cheaper.",
  "4-3": "Komparatif yang diulang menunjukkan perubahan yang terus berlanjut.",
  "4-4": "Kata sifat panjang → more difficult than.",
  "4-5": "easy → easier; “more easier” menggandakan komparatif.",
  "4-6": "“Far” memperkuat komparatif: far more expensive.",
  "4-7": "Pola: The + komparatif…, the + komparatif…",
  "5-0": "“The number of” tunggal → has.",
  "5-1": "Subjeknya jamak, “crime rates” → are.",
  "5-2": "Dengan neither…nor, kata kerja mengikuti subjek terdekat: students → were.",
  "5-3": "Dua subjek dihubungkan “and” → kata kerja jamak.",
  "5-4": "“Every one of…” tunggal → is.",
  "5-5": "“Research” tak terhitung, kata kerjanya tunggal → has.",
  "5-6": "“Some of” + “information” yang tak terhitung → tunggal: is.",
  "5-7": "Mathematics terlihat jamak tetapi maknanya tunggal.",
  "6-0": "Dua aksi selesai secara berurutan → past simple + past simple.",
  "6-1": "Aksi latar yang sedang berlangsung (were hiking) dipotong past simple (hit).",
  "6-2": "Aksi yang lebih dulu memakai past perfect: had already left.",
  "6-3": "Durasi sebelum kejadian lampau → past perfect continuous, lalu past simple.",
  "6-4": "Urutan aksi cepat yang selesai → past simple.",
  "6-5": "Aksi sedang berlangsung (was cooking) dipotong aksi singkat (rang).",
  "6-6": "Menyelesaikan laporan terjadi lebih dulu → past perfect; lalu past simple “felt”.",
  "6-7": "Menunggunya berlanjut sampai bus tiba → had been waiting + arrived.",
  "7-0": "“Believe” kata kerja keadaan → present simple.",
  "7-1": "Durasi sampai sekarang (for the last six months) → present perfect continuous.",
  "7-2": "“Ever … before” (pengalaman sampai sekarang) → present perfect.",
  "7-3": "Aksi sementara yang sedang berlangsung (at the moment) → present continuous.",
  "7-4": "“Yet” menghubungkan lampau dengan sekarang → present perfect negatif.",
  "7-5": "Terjadi sekitar sekarang dan sifatnya sementara → am preparing.",
  "7-6": "Grafik menyatakan fakta → present simple: shows.",
  "7-7": "Dimulai di masa lalu dan masih berlangsung (for three months) → present perfect.",
  "8-0": "Sedang berlangsung di waktu depan (kehidupan tahun 2100) → future continuous.",
  "8-1": "Keadaan masa depan yang sederhana → won’t be.",
  "8-2": "Menggambarkan keadaan pada waktu itu → will be.",
  "8-3": "Aktivitas yang sedang berlangsung pada waktu itu → future continuous.",
  "8-4": "Selesai sebelum titik itu → future perfect.",
  "8-5": "Prediksi sederhana tentang perannya kelak → will likely serve.",
  "8-6": "Durasi sampai satu titik depan (for several years) → future perfect continuous.",
  "8-7": "Selesai pada 2065 → future perfect.",
  "9-0": "“At the moment” → pasif present continuous: are being reviewed.",
  "9-1": "“Yesterday” → pasif past simple: was submitted.",
  "9-2": "“Already”, masih relevan sekarang → pasif present perfect.",
  "9-3": "Rutinitas → pasif present simple: are inspected.",
  "9-4": "“Last year” → pasif past simple: were implemented.",
  "9-5": "Sedang berlangsung saat kunjungan lampau → pasif past continuous.",
  "9-6": "“Next week” → pasif future: will be approved.",
  "9-7": "Aktif present continuous → pasif present continuous: are being conducted.",
  "10-0": "Conditional tipe 2: If + past simple … would + kata kerja dasar.",
  "10-1": "Hasil conditional tipe 3 → would have + V3.",
  "10-2": "Situasi nyata dan mungkin → tipe 1: will / won’t.",
  "10-3": "Tidak nyata di masa kini dengan “be” → If I were.",
  "10-4": "Hasil conditional tipe 2 → would decrease.",
  "10-5": "Syarat lampau yang tidak nyata → would have + V3.",
  "10-6": "Kemungkinan nyata di masa depan → tipe 1: will reduce.",
  "10-7": "Conditional campuran: syarat lampau, hasil sekarang → would be … now.",
  "11-0": "Kemungkinan lampau yang tidak terjadi → could have + V3.",
  "11-1": "Yakin tentang masa lalu berdasar bukti → must have.",
  "11-2": "Yakin sesuatu mustahil terjadi di masa lalu → can’t have.",
  "11-3": "Penyesalan tentang masa lalu → should have + V3.",
  "11-4": "“Had better” menyiratkan akibat buruk jika saran diabaikan.",
  "11-5": "Keharusan yang kuat → must.",
  "11-6": "Kemungkinan yang tidak pasti → might.",
  "11-7": "“Can” tidak punya bentuk masa depan → will be able to.",
  "12-0": "Orang sebagai subjek → who (atau that).",
  "12-1": "Tempat → where.",
  "12-2": "Kepemilikan (strategi si pelatih) → whose.",
  "12-3": "Waktu → when.",
  "12-4": "Kepemilikan (ayah si pemain) → whose.",
  "12-5": "Benda → which (atau that).",
  "12-6": "Klausa defining tentang tim → that (atau which).",
  "12-7": "Klausa non-defining (dengan koma) memakai who — tidak pernah “that”.",
  "13-0": "Klausa alasan → because.",
  "13-1": "Klausa waktu → When.",
  "13-2": "Despite + frasa benda (although butuh klausa lengkap).",
  "13-3": "Tujuan → so that + klausa.",
  "13-4": "Kontras antara usaha dan hasil → Although.",
  "13-5": "Even though + klausa menunjukkan kontras.",
  "13-6": "Dua klausa independen butuh kata hubung — koma saja adalah comma splice.",
  "13-7": "Klausa “while” sendirian adalah fragmen — perlu klausa independen.",
};

// ---------- Context practice: fuller everyday scenarios ----------
// Fuller, everyday contexts using common Oxford 3000-level vocabulary.
const QUIZ2 = {
  1: [
    { q: "My town has a new library and a sports centre. ___ library is open every day, but the sports centre closes on Sundays.", opts: ["A", "An", "The", "Ø (no article)"], a: 2, ex: "The library was already mentioned, so the second mention takes ‘the’.", exId: "Perpustakaannya sudah disebut sebelumnya, jadi penyebutan kedua memakai “the”." },
    { q: "Maria works as ___ engineer in a large company. She enjoys her job because every project is different.", opts: ["a", "an", "the", "Ø (no article)"], a: 1, ex: "Jobs take a/an, and ‘engineer’ begins with a vowel sound → an.", exId: "Profesi memakai a/an, dan “engineer” diawali bunyi vokal → an." },
    { q: "In my opinion, ___ money cannot buy happiness, but it can make life easier for many families.", opts: ["a", "the", "Ø (no article)", "an"], a: 2, ex: "‘Money’ is uncountable and used in a general sense → no article.", exId: "“Money” tak terhitung dan bermakna umum → tanpa artikel." },
    { q: "Last year we visited ___ United States to see my uncle, who lives in Chicago.", opts: ["Ø (no article)", "a", "the", "an"], a: 2, ex: "Country names with ‘United’, ‘Republic’ or a plural form take ‘the’: the United States.", exId: "Nama negara dengan “United”, “Republic”, atau bentuk jamak memakai “the”: the United States." },
  ],
  2: [
    { q: "Before I chose my university, my teacher gave me ___ useful advice about courses and costs.", opts: ["a", "many", "some", "a few"], a: 2, ex: "‘Advice’ is uncountable → some (‘a’, ‘many’ and ‘a few’ need countable nouns).", exId: "“Advice” tak terhitung → some (“a”, “many”, “a few” butuh kata benda terhitung)." },
    { q: "We wanted to cook dinner together, but there was very ___ food in the fridge, so we went to the market.", opts: ["few", "little", "many", "a number of"], a: 1, ex: "‘Food’ is uncountable and the meaning is ‘not enough’ → little.", exId: "“Food” tak terhitung dan maknanya “hampir tidak ada” → little." },
    { q: "The hotel was quiet because there weren’t ___ guests during the winter season.", opts: ["much", "some", "many", "a little"], a: 2, ex: "‘Guests’ is countable and the sentence is negative → many.", exId: "“Guests” terhitung dan kalimatnya negatif → many." },
    { q: "Scientists still need ___ about how the disease spreads before they can give clear rules.", opts: ["more informations", "more information", "many informations", "an information"], a: 1, ex: "‘Information’ has no plural and no a/an → more information.", exId: "“Information” tidak punya bentuk jamak dan tidak memakai a/an → more information." },
  ],
  3: [
    { q: "Young people today depend ___ their phones for news, maps and even payment.", opts: ["of", "on", "in", "to"], a: 1, ex: "Depend / rely on something.", exId: "Depend / rely on sesuatu." },
    { q: "After months of practice, Rina felt ready and was not afraid ___ the speaking test anymore.", opts: ["from", "about", "of", "with"], a: 2, ex: "Afraid of — adjective + of.", exId: "Afraid of — kata sifat + of." },
    { q: "There has been a sharp increase ___ the price of basic food in many countries this year.", opts: ["of", "on", "at", "in"], a: 3, ex: "An increase / rise / fall in something.", exId: "An increase / rise / fall in sesuatu." },
    { q: "Parents are usually responsible ___ teaching children good habits at home.", opts: ["for", "to", "about", "on"], a: 0, ex: "Responsible for + -ing.", exId: "Responsible for + -ing." },
  ],
  4: [
    { q: "Traveling by train is often ___ than driving, because you can read or sleep on the way.", opts: ["relaxing", "more relaxing", "the most relaxing", "most relaxing"], a: 1, ex: "Comparing two options with a long adjective → more relaxing than.", exId: "Membandingkan dua pilihan dengan kata sifat panjang → more relaxing than." },
    { q: "Of the three hotels we compared, this one was ___ and also the cheapest.", opts: ["the most comfortable", "more comfortable", "most comfortable of", "comfortabler"], a: 0, ex: "A group of three or more → superlative with ‘the’: the most comfortable.", exId: "Kelompok tiga atau lebih → superlatif dengan “the”: the most comfortable." },
    { q: "The new airport is not ___ as the old one; the old airport was closer to the city.", opts: ["convenient", "more convenient", "as convenient", "the most convenient"], a: 2, ex: "Equal (or not equal) comparison → (not) as + adjective + as.", exId: "Perbandingan setara (atau tidak setara) → (not) as + kata sifat + as." },
    { q: "___ people exercise, the healthier they usually feel.", opts: ["The more", "More", "The most", "Most"], a: 0, ex: "Double comparative pattern: The more…, the healthier…", exId: "Pola komparatif ganda: The more…, the healthier…" },
  ],
  5: [
    { q: "A number of new restaurants ___ opened near the station, so the area is much busier now.", opts: ["has", "have", "is", "was"], a: 1, ex: "‘A number of…’ is plural → have.", exId: "“A number of…” jamak → have." },
    { q: "Everyone in my family ___ to cook, but my mother is the best cook of all.", opts: ["like", "likes", "are liking", "have liked"], a: 1, ex: "‘Everyone’ is singular → likes.", exId: "“Everyone” tunggal → likes." },
    { q: "The quality of these products ___ improved since the company changed its factory.", opts: ["have", "has", "are", "were"], a: 1, ex: "The head noun is ‘quality’ (singular), not ‘products’ → has.", exId: "Inti subjeknya “quality” (tunggal), bukan “products” → has." },
    { q: "There ___ several reasons why people move to big cities, such as jobs and education.", opts: ["is", "was", "are", "has been"], a: 2, ex: "‘There are’ agrees with the plural subject ‘several reasons’.", exId: "“There are” mengikuti subjek jamak “several reasons”." },
  ],
  6: [
    { q: "When the fire alarm rang, most students ___ lunch in the school hall.", opts: ["ate", "were eating", "had eaten", "eat"], a: 1, ex: "In progress when the alarm rang → past continuous.", exId: "Sedang berlangsung saat alarm berbunyi → past continuous." },
    { q: "By the time we reached the cinema, the film ___, so we missed the beginning.", opts: ["started", "was starting", "had already started", "starts"], a: 2, ex: "The film started before we arrived → past perfect.", exId: "Film mulai sebelum kami tiba → past perfect." },
    { q: "My grandfather ___ to the city in 1990 and opened a small shop there.", opts: ["moves", "was moving", "moved", "had been moving"], a: 2, ex: "A completed action at a stated past time (1990) → past simple.", exId: "Aksi selesai pada waktu lampau yang jelas (1990) → past simple." },
    { q: "They ___ for the results for two weeks when the letter finally arrived.", opts: ["waited", "were waiting", "had been waiting", "have waited"], a: 2, ex: "Duration up to a past moment → past perfect continuous.", exId: "Durasi sampai satu titik lampau → past perfect continuous." },
  ],
  7: [
    { q: "My sister ___ in a hospital; she starts work at seven every morning.", opts: ["is working", "works", "has worked", "work"], a: 1, ex: "A permanent job and routine → present simple.", exId: "Pekerjaan tetap dan rutinitas → present simple." },
    { q: "More and more people ___ online instead of going to shops these days.", opts: ["shop", "are shopping", "have shopped", "shopped"], a: 1, ex: "A growing trend (more and more … these days) → present continuous.", exId: "Tren yang sedang berkembang (more and more … these days) → present continuous." },
    { q: "I ___ my keys, so I can’t open the door now.", opts: ["lost", "have lost", "was losing", "lose"], a: 1, ex: "A past action with a present result → present perfect.", exId: "Aksi lampau dengan akibat sekarang → present perfect." },
    { q: "We ___ each other since primary school, so we know each other very well.", opts: ["know", "are knowing", "have known", "knew"], a: 2, ex: "‘Since’ + a state continuing until now → present perfect (state verbs avoid the continuous).", exId: "“Since” + keadaan yang berlanjut sampai kini → present perfect (kata kerja keadaan tidak memakai bentuk continuous)." },
  ],
  8: [
    { q: "Look at those dark clouds — it ___ soon, so bring an umbrella.", opts: ["will rain", "is going to rain", "rains", "is raining"], a: 1, ex: "A prediction from present evidence (the dark clouds) → going to.", exId: "Prediksi dari bukti yang terlihat (awan gelap) → going to." },
    { q: "The last bus ___ at 11 p.m., so we need to finish dinner before that.", opts: ["leaves", "will leave", "is going to leave", "left"], a: 0, ex: "Timetables use the present simple: the bus leaves at 11.", exId: "Jadwal memakai present simple: the bus leaves at 11." },
    { q: "Don’t call her at 8 tonight — she ___ for her exam then.", opts: ["will study", "will be studying", "studies", "is going to have studied"], a: 1, ex: "In progress at a stated future time (at 8 tonight) → future continuous.", exId: "Sedang berlangsung pada waktu tertentu di masa depan (jam 8 nanti malam) → future continuous." },
    { q: "By next June, my parents ___ in this house for thirty years.", opts: ["will live", "will be living", "will have lived", "are living"], a: 2, ex: "Completed duration by a future point (by next June … for thirty years) → future perfect.", exId: "Durasi yang genap pada satu titik depan (by next June … for thirty years) → future perfect." },
  ],
  9: [
    { q: "A large amount of rice ___ in Indonesia every year.", opts: ["produces", "is produced", "is producing", "has produced"], a: 1, ex: "The rice doesn’t act; it receives the action → present simple passive: is produced.", exId: "Beras tidak melakukan aksi, melainkan dikenai aksi → pasif present simple: is produced." },
    { q: "This bridge ___ more than a hundred years ago, but it is still safe to use.", opts: ["built", "was built", "is built", "has built"], a: 1, ex: "A finished past event (a hundred years ago) → past simple passive.", exId: "Kejadian lampau yang selesai (seratus tahun lalu) → pasif past simple." },
    { q: "The road is closed today because it ___.", opts: ["repairs", "is repairing", "is being repaired", "repaired"], a: 2, ex: "Happening to the road right now → present continuous passive.", exId: "Sedang terjadi pada jalannya saat ini → pasif present continuous." },
    { q: "All the tickets ___, so we cannot watch the concert tonight.", opts: ["have been sold", "have sold", "are selling", "sold"], a: 0, ex: "A recently completed action with a present result → present perfect passive.", exId: "Aksi yang baru selesai dengan akibat sekarang → pasif present perfect." },
  ],
  10: [
    { q: "If the weather ___ good tomorrow, we will have a picnic by the river.", opts: ["is", "will be", "was", "were"], a: 0, ex: "First conditional: If + present simple, will.", exId: "Conditional tipe 1: If + present simple, will." },
    { q: "If I ___ closer to my office, I would walk to work instead of driving.", opts: ["live", "lived", "had lived", "will live"], a: 1, ex: "An unreal present situation → second conditional: If + past simple.", exId: "Situasi kini yang tidak nyata → tipe 2: If + past simple." },
    { q: "She would have caught the train if she ___ home five minutes earlier.", opts: ["leaves", "left", "had left", "would leave"], a: 2, ex: "An unreal past → third conditional: if + past perfect.", exId: "Masa lampau yang tidak nyata → tipe 3: if + past perfect." },
    { q: "If he had saved money when he was young, he ___ rich now.", opts: ["would have been", "would be", "will be", "is"], a: 1, ex: "Mixed conditional: past condition, present result → would be … now.", exId: "Conditional campuran: syarat lampau, hasil sekarang → would be … now." },
  ],
  11: [
    { q: "You ___ wear a helmet when you ride a motorbike — it’s the law.", opts: ["might", "could", "must", "would"], a: 2, ex: "A legal obligation → must.", exId: "Kewajiban hukum → must." },
    { q: "The office lights are off and the door is locked. Everyone ___ home already.", opts: ["must go", "can’t have gone", "must have gone", "should go"], a: 2, ex: "Sure about a past action from evidence → must have + V3.", exId: "Yakin tentang aksi lampau dari bukti → must have + V3." },
    { q: "I failed the test. I ___ more instead of playing games every night.", opts: ["should have studied", "must have studied", "could study", "had to study"], a: 0, ex: "Regret about the past → should have + V3.", exId: "Penyesalan tentang masa lalu → should have + V3." },
    { q: "Take your umbrella — it ___ rain later, although the sky looks clear now.", opts: ["must", "might", "should", "can’t"], a: 1, ex: "An uncertain possibility → might.", exId: "Kemungkinan yang tidak pasti → might." },
  ],
  12: [
    { q: "The woman ___ lives next door is a doctor at the city hospital.", opts: ["which", "who", "whose", "where"], a: 1, ex: "A person as the subject → who.", exId: "Orang sebagai subjek → who." },
    { q: "We stayed in a small town ___ the houses are painted in bright colors.", opts: ["which", "who", "where", "when"], a: 2, ex: "A place → where.", exId: "Tempat → where." },
    { q: "My laptop, ___ I bought only last year, has already stopped working.", opts: ["that", "which", "who", "whose"], a: 1, ex: "A non-defining clause (commas) about a thing → which, never ‘that’.", exId: "Klausa non-defining (dengan koma) untuk benda → which, tidak boleh “that”." },
    { q: "I have a friend ___ brother plays football for the national team.", opts: ["who", "which", "whose", "that"], a: 2, ex: "Possession (my friend’s brother) → whose.", exId: "Kepemilikan (kakak teman saya) → whose." },
  ],
  13: [
    { q: "___ the heavy traffic, we arrived at the airport on time.", opts: ["Although", "Because", "Despite", "Even though"], a: 2, ex: "Despite + noun phrase; although / even though need a clause.", exId: "Despite + frasa benda; although / even though butuh klausa." },
    { q: "Many families are moving out of the city ___ house prices have become too high.", opts: ["despite", "because", "so that", "in spite of"], a: 1, ex: "A reason clause → because.", exId: "Klausa alasan → because." },
    { q: "She takes an English class twice a week ___ she can get a better job abroad.", opts: ["although", "because of", "so that", "despite"], a: 2, ex: "Purpose → so that + clause.", exId: "Tujuan → so that + klausa." },
    { q: "Which sentence is correct?", opts: ["Because the restaurant was full. We went home.", "Because the restaurant was full, we went home.", "The restaurant was full, we went home."], a: 1, ex: "A dependent ‘because’ clause must attach to an independent clause; a comma alone between two clauses is a splice.", exId: "Klausa “because” harus menempel pada klausa independen; koma saja di antara dua klausa adalah comma splice." },
  ],
};

// ---------- UI strings (EN / ID) ----------
const T = {
  en: {
    heroTitle: "From common mistakes to Band 7",
    heroSub: (n) => `Interactive grammar practice — 13 units, ${n} practice questions, and an AI writing examiner.`,
    statsLine: (p, m) => `${p}/13 units practiced · ${m} mastered (80%+)`,
    lastEssay: (b) => ` · last essay ${b}`,
    writingTitle: "Writing Lab",
    writingSub: "Write a Task 2 essay under exam timing, then get an AI band estimate with feedback linked to these units.",
    unitsHeader: "Grammar units",
    unitsHint: "Learn, then practice",
    newLabel: "New",
    footer: "A personal IELTS grammar study app — 13 units, targeted drills, and an AI writing examiner. Progress is saved on this device.",
    allUnits: "All units",
    learnTab: "Learn",
    practiceTab: "Practice",
    practiceBtn: "Practice this unit",
    deckCore: "Core drill",
    deckCoreSub: "Targeted questions on each unit's key rules, with a worked explanation for every answer.",
    deckCtx: "Context practice",
    deckCtxSub: "Fuller, real-world contexts using everyday (Oxford 3000-level) vocabulary.",
    qWord: "questions",
    best: "Best",
    qOf: (i, n) => `Question ${i} of ${n}`,
    correct: "correct",
    correctAnswer: "Correct answer:",
    next: "Next question",
    seeResults: "See results",
    tryAgain: "Try again",
    backToDecks: "Back to practice",
    msg90: "Outstanding — Band 7 territory!",
    msg70: "Solid work. Review the ones you missed.",
    msg50: "Good start — reread the Learn tab and try again.",
    msg0: "Revisit the Learn tab first, then retry.",
    home: "Home",
    wlKicker: "WRITING TASK 2 · 40 MIN · 250+ WORDS",
    wlSub: "Pick a question, write under exam conditions, then get an AI band estimate.",
    examNote: "Questions are in English, exactly as in the real exam.",
    customOpen: "+ Use your own Task 2 question",
    customPh: "Paste or type a Task 2 question…",
    customTitle: "Custom question",
    customBtn: "Write on this question",
    recent: "Recent essays",
    words: "words",
    aim: " · aim for 250+",
    tStart: " · start",
    tPaused: " · paused",
    timeUp: "Time is up — in the real exam you would stop here, but you can keep writing.",
    scoreErr: "The assessment didn’t come back in a readable format. Your essay is still here — try again in a moment.",
    submitLow: "Write at least 40 words",
    submit: "Get my band estimate",
    under250: "Under 250 words — real examiners penalize short essays, and this estimate will too.",
    gradingTitle: "Examining your essay…",
    gradingSub: "Checking task response, coherence, vocabulary and grammar. This takes a few seconds.",
    questionsBack: "Questions",
    estBand: "ESTIMATED OVERALL BAND",
    workingWell: "Working well",
    focusNext: "Focus next",
    fixFirst: "Fix these first",
    review: (id, t) => `Review Unit ${id} · ${t}`,
    disclaimer: "This band is an AI estimate based on the public IELTS descriptors. It is not an official result, and a certified examiner’s scores may differ.",
    another: "Write another essay",
    backHome: "Back home",
    task2: "TASK 2",
    wlBack: "Writing Lab",
  },
  id: {
    heroTitle: "Dari kesalahan umum menuju Band 7",
    heroSub: (n) => `Latihan tata bahasa interaktif — 13 unit, ${n} soal latihan, dan pemeriksa writing berbasis AI.`,
    statsLine: (p, m) => `${p}/13 unit dipelajari · ${m} dikuasai (80%+)`,
    lastEssay: (b) => ` · esai terakhir ${b}`,
    writingTitle: "Writing Lab",
    writingSub: "Tulis esai Task 2 dengan waktu ujian, lalu dapatkan estimasi band AI dengan umpan balik yang terhubung ke unit-unit ini.",
    unitsHeader: "Unit tata bahasa",
    unitsHint: "Pelajari, lalu latihan",
    newLabel: "Baru",
    footer: "Aplikasi belajar tata bahasa IELTS untuk pribadi — 13 unit, latihan soal terarah, dan pemeriksa writing berbasis AI. Progres tersimpan di perangkat ini.",
    allUnits: "Semua unit",
    learnTab: "Materi",
    practiceTab: "Latihan",
    practiceBtn: "Latihan unit ini",
    deckCore: "Latihan inti",
    deckCoreSub: "Soal terarah untuk aturan tiap unit, dengan penjelasan di setiap jawaban.",
    deckCtx: "Latihan konteks",
    deckCtxSub: "Konteks sehari-hari yang lebih panjang dengan kosakata umum (level Oxford 3000).",
    qWord: "soal",
    best: "Terbaik",
    qOf: (i, n) => `Soal ${i} dari ${n}`,
    correct: "benar",
    correctAnswer: "Jawaban benar:",
    next: "Soal berikutnya",
    seeResults: "Lihat hasil",
    tryAgain: "Coba lagi",
    backToDecks: "Kembali ke latihan",
    msg90: "Luar biasa — sudah level Band 7!",
    msg70: "Bagus. Tinjau lagi soal yang salah.",
    msg50: "Awal yang baik — baca ulang tab Materi lalu coba lagi.",
    msg0: "Pelajari dulu tab Materi, lalu ulangi.",
    home: "Beranda",
    wlKicker: "WRITING TASK 2 · 40 MENIT · 250+ KATA",
    wlSub: "Pilih soal, tulis dalam kondisi ujian, lalu dapatkan estimasi band dari AI.",
    examNote: "Soal ditampilkan dalam bahasa Inggris, sama seperti ujian aslinya.",
    customOpen: "+ Pakai soal Task 2 Anda sendiri",
    customPh: "Tempel atau ketik soal Task 2…",
    customTitle: "Soal sendiri",
    customBtn: "Tulis dari soal ini",
    recent: "Esai terakhir",
    words: "kata",
    aim: " · targetkan 250+",
    tStart: " · mulai",
    tPaused: " · jeda",
    timeUp: "Waktu habis — di ujian asli Anda berhenti di sini, tetapi di sini boleh lanjut menulis.",
    scoreErr: "Hasil penilaian tidak terbaca. Esai Anda masih tersimpan — coba lagi sebentar lagi.",
    submitLow: "Tulis minimal 40 kata",
    submit: "Dapatkan estimasi band",
    under250: "Di bawah 250 kata — penguji sungguhan memberi penalti untuk esai pendek, begitu juga estimasi ini.",
    gradingTitle: "Sedang memeriksa esai Anda…",
    gradingSub: "Mengecek task response, koherensi, kosakata, dan tata bahasa. Butuh beberapa detik.",
    questionsBack: "Daftar soal",
    estBand: "ESTIMASI BAND KESELURUHAN",
    workingWell: "Sudah baik",
    focusNext: "Fokus berikutnya",
    fixFirst: "Perbaiki ini dulu",
    review: (id, t) => `Pelajari Unit ${id} · ${t}`,
    disclaimer: "Band ini estimasi AI berdasarkan deskriptor publik IELTS — bukan hasil resmi, dan skor penguji bersertifikat bisa berbeda.",
    another: "Tulis esai lain",
    backHome: "Kembali ke beranda",
    task2: "TASK 2",
    wlBack: "Writing Lab",
  },
};

// ---------- UI atoms ----------
function Shell({ children }) {
  return (
    <div className="min-h-screen" style={{ background: C.paper, color: C.ink, ...body }}>
      <style>{FONT_CSS}</style>
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-6">{children}</div>
    </div>
  );
}

function Btn({ children, onClick, disabled, tone = "blue", full }) {
  const bg = tone === "red" ? C.red : tone === "ghost" ? "transparent" : C.blue;
  const fg = tone === "ghost" ? C.blue : "#FFFFFF";
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold transition ${full ? "w-full" : ""}`}
      style={{ ...display, fontSize: 15, background: disabled ? C.line : bg, color: disabled ? C.sub : fg,
        border: tone === "ghost" ? `2px solid ${C.blue}` : "none", cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}

function BackBar({ onBack, label }) {
  return (
    <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-4" style={{ color: C.sub, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <ChevronLeft size={18} /> {label}
    </button>
  );
}

function MiniBar({ pct, color, track }) {
  return (
    <div className="w-full rounded-full" style={{ height: 8, background: track || C.line }}>
      <div className="rounded-full" style={{ height: 8, width: `${Math.min(100, Math.max(0, pct))}%`, background: color || C.blue, transition: "width .5s ease" }} />
    </div>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="inline-flex rounded-full p-1" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      {["en", "id"].map(l => (
        <button key={l} onClick={() => setLang(l)} className="rounded-full px-3 py-1 text-xs font-bold uppercase transition"
          style={{ ...display, background: lang === l ? C.blue : "transparent", color: lang === l ? "#fff" : C.sub, border: "none", cursor: "pointer" }}>
          {l === "en" ? "EN" : "ID"}
        </button>
      ))}
    </div>
  );
}

// ---------- Home ----------
function unitPct(progress, id) {
  const list = [progress[id], progress["x" + id]].filter(Boolean).map(p => Math.round((p.best / p.total) * 100));
  return list.length ? Math.max(...list) : null;
}

function HomeScreen({ progress, history, openUnit, openWriting, lang }) {
  const tr = T[lang];
  const practiced = UNITS.filter(u => progress[u.id] || progress["x" + u.id]).length;
  const mastered = UNITS.filter(u => { const p = unitPct(progress, u.id); return p !== null && p >= 80; }).length;
  const totalQ = UNITS.reduce((n, u) => n + u.quiz.length + ((QUIZ2[u.id] || []).length), 0);
  const last = history[0];
  return (
    <div>
      <div className="rounded-3xl overflow-hidden mb-5 flex" style={{ background: C.blue }}>
        <div style={{ width: 14, background: C.red, flexShrink: 0 }} />
        <div className="p-6 sm:p-8 text-white flex-1">
          <div className="text-xs font-bold mb-1" style={{ color: "#BFC7FF", letterSpacing: "0.16em" }}>IELTS GRAMMAR ROADMAP</div>
          <h1 style={{ ...display, fontSize: 34, fontWeight: 800, lineHeight: 1.05 }}>{tr.heroTitle}</h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "#DDE1FF" }}>{tr.heroSub(totalQ)}</p>
          <div className="mt-4">
            <MiniBar pct={(practiced / 13) * 100} color="#FFFFFF" track="rgba(255,255,255,0.25)" />
            <div className="mt-2 text-xs font-semibold" style={{ color: "#DDE1FF" }}>
              {tr.statsLine(practiced, mastered)}{last && typeof last.overall === "number" ? tr.lastEssay(bandStr(last.overall)) : ""}
            </div>
          </div>
        </div>
      </div>

      <button onClick={openWriting} className="w-full text-left rounded-3xl mb-5 flex overflow-hidden" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer", padding: 0 }}>
        <div style={{ width: 8, background: C.red, flexShrink: 0 }} />
        <div className="p-5 flex-1 flex items-center gap-4">
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: C.redWash, color: C.red, flexShrink: 0 }}>
            <PenLine size={22} />
          </div>
          <div className="flex-1">
            <div style={{ ...display, fontWeight: 700, fontSize: 18 }}>{tr.writingTitle}</div>
            <div className="text-sm leading-relaxed" style={{ color: C.sub }}>{tr.writingSub}</div>
          </div>
          <ArrowRight size={20} style={{ color: C.red, flexShrink: 0 }} />
        </div>
      </button>

      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2" style={{ ...display, fontSize: 22, fontWeight: 800 }}>
          <BookOpen size={20} style={{ color: C.blue }} /> {tr.unitsHeader}
        </h2>
        <span className="text-xs font-semibold" style={{ color: C.sub }}>{tr.unitsHint}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {UNITS.map(u => {
          const pct = unitPct(progress, u.id);
          const good = pct !== null && pct >= 80;
          return (
            <button key={u.id} onClick={() => openUnit(u.id)} className="text-left rounded-2xl p-4 transition" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ ...display, background: C.red }}>Unit {u.id}</span>
                {pct === null
                  ? <span className="text-xs font-semibold" style={{ color: C.sub }}>{tr.newLabel}</span>
                  : <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: good ? C.greenWash : C.amberWash, color: good ? C.green : C.amber }}>{pct}%</span>}
              </div>
              <div style={{ ...display, fontWeight: 700, fontSize: 16, lineHeight: 1.15 }}>{u.title}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: C.sub }}>{lang === "id" ? (TAG_ID[u.id] || u.tag) : u.tag}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center text-xs leading-relaxed" style={{ color: C.sub }}>{tr.footer}</div>
    </div>
  );
}

// ---------- Unit: Learn + Practice ----------
function LearnTab({ unit, onPractice, lang }) {
  const tr = T[lang];
  const sums = LEARN_ID[unit.id] || [];
  return (
    <div className="flex flex-col gap-3">
      {unit.learn.map((s, i) => (
        <div key={i} className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div style={{ ...display, fontWeight: 700, fontSize: 16, color: C.blue }}>{s.h}</div>
          {lang === "id" && sums[i] && (
            <div className="text-sm mt-1 mb-1 leading-relaxed" style={{ color: C.blueDark, fontStyle: "italic" }}>{sums[i]}</div>
          )}
          <ul className="flex flex-col gap-2 mt-2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {s.b.map((line, j) => (
              <li key={j} className="flex gap-2 text-sm leading-relaxed">
                <span className="rounded-full" style={{ width: 6, height: 6, background: C.red, flexShrink: 0, marginTop: 7 }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Btn onClick={onPractice} full>{tr.practiceBtn} <ArrowRight size={16} /></Btn>
    </div>
  );
}

function Quiz({ list, unitId, isCtx, lang, onScore, onRestart, onExit }) {
  const tr = T[lang];
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const total = list.length;
  const q = list[i];

  const pick = (idx) => { if (sel !== null) return; setSel(idx); if (idx === q.a) setScore(s => s + 1); };
  const next = () => {
    if (i + 1 < total) { setI(i + 1); setSel(null); }
    else { setDone(true); onScore(score, total); }
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const msg = pct >= 90 ? tr.msg90 : pct >= 70 ? tr.msg70 : pct >= 50 ? tr.msg50 : tr.msg0;
    return (
      <div className="rounded-2xl p-6 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <div className="mx-auto mb-3 rounded-full flex items-center justify-center" style={{ width: 64, height: 64, background: pct >= 70 ? C.greenWash : C.amberWash, color: pct >= 70 ? C.green : C.amber }}>
          <Trophy size={28} />
        </div>
        <div style={{ ...display, fontWeight: 800, fontSize: 30 }}>{score} / {total}</div>
        <p className="text-sm mt-1 mb-5" style={{ color: C.sub }}>{msg}</p>
        <div className="flex flex-col gap-2">
          <Btn onClick={onRestart} full><RotateCcw size={16} /> {tr.tryAgain}</Btn>
          <Btn tone="ghost" onClick={onExit} full>{tr.backToDecks}</Btn>
        </div>
      </div>
    );
  }

  const exText = lang === "id"
    ? (isCtx ? (q.exId || q.ex) : (EX_ID[unitId + "-" + i] || q.ex))
    : q.ex;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs font-semibold" style={{ color: C.sub }}>
        <span>{tr.qOf(i + 1, total)}</span>
        <span>{score} {tr.correct}</span>
      </div>
      <MiniBar pct={(i / total) * 100} />
      <div className="rounded-2xl p-5 mt-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <div className="text-base font-medium leading-relaxed mb-4">{q.q}</div>
        <div className="flex flex-col gap-2">
          {q.opts.map((o, idx) => {
            const isC = sel !== null && idx === q.a;
            const isW = sel !== null && idx === sel && sel !== q.a;
            return (
              <button key={idx} onClick={() => pick(idx)}
                className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition flex items-center justify-between gap-2"
                style={{ background: isC ? C.greenWash : isW ? C.redWash : C.card,
                  border: `2px solid ${isC ? C.green : isW ? C.red : C.line}`,
                  color: isC ? C.green : isW ? C.red : C.ink,
                  cursor: sel === null ? "pointer" : "default" }}>
                <span>{o}</span>
                {isC && <Check size={18} style={{ flexShrink: 0 }} />}
                {isW && <X size={18} style={{ flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
        {sel !== null && (
          <div className="rounded-xl p-3 mt-4 flex gap-2 text-sm leading-relaxed" style={{ background: C.blueWash, color: C.blueDark }}>
            <Lightbulb size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{sel === q.a ? "" : `${tr.correctAnswer} ${q.opts[q.a]}. `}{exText}</span>
          </div>
        )}
        {sel !== null && (
          <div className="mt-4">
            <Btn onClick={next} full>{i + 1 < total ? tr.next : tr.seeResults} <ArrowRight size={16} /></Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeTab({ unit, progress, onScore, lang }) {
  const tr = T[lang];
  const [deck, setDeck] = useState(null);
  const [session, setSession] = useState(1);
  const ctxList = QUIZ2[unit.id] || [];

  if (!deck) {
    const decks = [
      { key: unit.id, list: unit.quiz, isCtx: false, title: tr.deckCore, sub: tr.deckCoreSub, icon: <Play size={22} />, wash: C.blueWash, color: C.blue },
      { key: "x" + unit.id, list: ctxList, isCtx: true, title: tr.deckCtx, sub: tr.deckCtxSub, icon: <Sparkles size={22} />, wash: C.redWash, color: C.red },
    ].filter(d => d.list.length > 0);
    return (
      <div className="flex flex-col gap-3">
        {decks.map(d => {
          const p = progress[d.key];
          return (
            <button key={d.key} onClick={() => { setDeck(d); setSession(s => s + 1); }} className="text-left rounded-2xl p-4 flex items-center gap-4" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48, background: d.wash, color: d.color, flexShrink: 0 }}>{d.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span style={{ ...display, fontWeight: 700, fontSize: 16 }}>{d.title}</span>
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.list.length} {tr.qWord}</span>
                </div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: C.sub }}>{d.sub}</div>
                {p && <div className="text-xs mt-1 font-bold" style={{ color: C.green }}>{tr.best}: {p.best}/{p.total}</div>}
              </div>
              <ArrowRight size={18} style={{ color: d.color, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Quiz key={deck.key + "-" + session} list={deck.list} unitId={unit.id} isCtx={deck.isCtx} lang={lang}
      onScore={(s, t) => onScore(deck.key, s, t)}
      onRestart={() => setSession(s => s + 1)}
      onExit={() => setDeck(null)} />
  );
}

function UnitScreen({ unit, progress, onScore, onBack, lang }) {
  const tr = T[lang];
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <BackBar onBack={onBack} label={tr.allUnits} />
      <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.blue }}>
        <div style={{ width: 10, background: C.red, flexShrink: 0 }} />
        <div className="p-5 text-white flex-1">
          <div className="text-xs font-bold" style={{ color: "#BFC7FF", letterSpacing: "0.14em" }}>UNIT {unit.id}</div>
          <div style={{ ...display, fontSize: 26, fontWeight: 800 }}>{unit.title}</div>
          <div className="text-sm" style={{ color: "#DDE1FF" }}>{lang === "id" ? (TAG_ID[unit.id] || unit.tag) : unit.tag}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("learn")} className="flex-1 rounded-full py-2.5 text-sm font-bold transition"
          style={{ ...display, background: tab === "learn" ? C.blue : C.card, color: tab === "learn" ? "#fff" : C.sub, border: `1px solid ${tab === "learn" ? C.blue : C.line}`, cursor: "pointer" }}>{tr.learnTab}</button>
        <button onClick={() => setTab("practice")} className="flex-1 rounded-full py-2.5 text-sm font-bold transition"
          style={{ ...display, background: tab === "practice" ? C.blue : C.card, color: tab === "practice" ? "#fff" : C.sub, border: `1px solid ${tab === "practice" ? C.blue : C.line}`, cursor: "pointer" }}>{tr.practiceTab}</button>
      </div>
      {tab === "learn"
        ? <LearnTab unit={unit} onPractice={() => setTab("practice")} lang={lang} />
        : <PracticeTab unit={unit} progress={progress} onScore={onScore} lang={lang} />}
    </div>
  );
}

// ---------- Writing Lab ----------
function WritingLab({ onBack, onSave, history, goUnit, lang }) {
  const tr = T[lang];
  const [phase, setPhase] = useState("pick");
  const [promptSel, setPromptSel] = useState(null);
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [essay, setEssay] = useState("");
  const [secs, setSecs] = useState(40 * 60);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecs(s => { if (s <= 1) { setRunning(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [running]);

  const wc = countWords(essay);
  const start = (p) => { setPromptSel(p); setPhase("write"); setEssay(""); setSecs(40 * 60); setRunning(false); setErr(null); };

  const submit = async () => {
    setPhase("grading"); setErr(null); setRunning(false);
    try {
      const r = await scoreEssay(promptSel.text, essay, lang);
      setResult(r);
      setPhase("result");
      onSave({ date: Date.now(), title: promptSel.title, words: wc, overall: r.overall });
    } catch (e) {
      setErr(tr.scoreErr);
      setPhase("write");
    }
  };

  if (phase === "pick") {
    return (
      <div>
        <BackBar onBack={onBack} label={tr.home} />
        <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.red }}>
          <div style={{ width: 10, background: C.blue, flexShrink: 0 }} />
          <div className="p-5 text-white flex-1">
            <div className="text-xs font-bold" style={{ color: "#FFD3D8", letterSpacing: "0.14em" }}>{tr.wlKicker}</div>
            <div style={{ ...display, fontSize: 26, fontWeight: 800 }}>{tr.writingTitle}</div>
            <div className="text-sm leading-relaxed" style={{ color: "#FFE3E6" }}>{tr.wlSub}</div>
            {lang === "id" && <div className="text-xs mt-1" style={{ color: "#FFD3D8" }}>{tr.examNote}</div>}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {WRITING_PROMPTS.map(p => (
            <button key={p.id} onClick={() => start(p)} className="text-left rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}`, cursor: "pointer" }}>
              <div className="flex items-center justify-between">
                <span style={{ ...display, fontWeight: 700, fontSize: 16 }}>{p.title}</span>
                <ArrowRight size={16} style={{ color: C.red, flexShrink: 0 }} />
              </div>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: C.sub }}>{p.text}</p>
            </button>
          ))}
          <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px dashed ${C.sub}` }}>
            {!showCustom ? (
              <button onClick={() => setShowCustom(true)} className="w-full text-left text-sm font-bold" style={{ color: C.blue, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {tr.customOpen}
              </button>
            ) : (
              <div>
                <textarea value={custom} onChange={e => setCustom(e.target.value)} rows={3} placeholder={tr.customPh}
                  className="w-full rounded-xl p-3 text-sm outline-none resize-none" style={{ border: `1px solid ${C.line}`, background: C.paper, ...body }} />
                <div className="mt-2"><Btn disabled={!custom.trim()} onClick={() => start({ title: tr.customTitle, text: custom.trim() })} full>{tr.customBtn}</Btn></div>
              </div>
            )}
          </div>
          {history.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-2 mb-2 text-sm font-bold" style={{ ...display }}>
                <History size={16} style={{ color: C.blue }} /> {tr.recent}
              </div>
              {history.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm" style={{ borderTop: i ? `1px solid ${C.line}` : "none", color: C.sub }}>
                  <span>{h.title} · {h.words} {tr.words}</span>
                  <span className="font-bold" style={{ color: C.blue }}>{bandStr(h.overall)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "write") {
    return (
      <div>
        <BackBar onBack={() => setPhase("pick")} label={tr.questionsBack} />
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.blueWash, border: `1px solid ${C.line}` }}>
          <div className="text-xs font-bold mb-1" style={{ color: C.blue, letterSpacing: "0.1em" }}>{tr.task2} · {promptSel.title.toUpperCase()}</div>
          <p className="text-sm leading-relaxed">{promptSel.text}</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: wc >= 250 ? C.green : wc > 0 ? C.amber : C.sub }}>
            {wc} {tr.words}{wc >= 250 ? " ✓" : tr.aim}
          </span>
          <button onClick={() => setRunning(r => !r)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
            style={{ background: secs <= 300 ? C.redWash : C.card, color: secs <= 300 ? C.red : C.ink, border: `1px solid ${C.line}`, cursor: "pointer" }}>
            <Clock size={15} /> {fmtTime(secs)}{running ? "" : secs === 40 * 60 ? tr.tStart : tr.tPaused}
          </button>
        </div>
        <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={14}
          placeholder={lang === "id" ? "Tulis esai Anda di sini (dalam bahasa Inggris). Buka dengan posisi Anda, kembangkan dua paragraf isi dengan contoh, lalu tutup dengan simpulan yang jelas." : "Write your essay here. Introduce your position, develop two body paragraphs with examples, and finish with a clear conclusion."}
          className="w-full rounded-2xl p-4 text-base leading-relaxed outline-none resize-none"
          style={{ border: `1px solid ${C.line}`, background: C.card, ...body }} />
        {secs === 0 && <div className="mt-2 text-sm font-semibold" style={{ color: C.red }}>{tr.timeUp}</div>}
        {err && (
          <div className="mt-2 rounded-xl p-3 text-sm flex gap-2 leading-relaxed" style={{ background: C.redWash, color: C.red }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{err}</span>
          </div>
        )}
        <div className="mt-3">
          <Btn tone="red" disabled={wc < 40} onClick={submit} full>
            <Sparkles size={16} /> {wc < 40 ? tr.submitLow : tr.submit}
          </Btn>
        </div>
        {wc >= 40 && wc < 250 && (
          <p className="mt-2 text-xs text-center leading-relaxed" style={{ color: C.sub }}>{tr.under250}</p>
        )}
      </div>
    );
  }

  if (phase === "grading") {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        <Loader2 size={36} className="animate-spin mx-auto mb-4" style={{ color: C.red }} />
        <div style={{ ...display, fontWeight: 800, fontSize: 20 }}>{tr.gradingTitle}</div>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: C.sub }}>{tr.gradingSub}</p>
      </div>
    );
  }

  const r = result || {};
  return (
    <div>
      <BackBar onBack={() => setPhase("pick")} label={tr.wlBack} />
      <div className="rounded-3xl overflow-hidden mb-4 flex" style={{ background: C.red }}>
        <div style={{ width: 10, background: C.blue, flexShrink: 0 }} />
        <div className="p-5 text-white flex-1 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold" style={{ color: "#FFD3D8", letterSpacing: "0.14em" }}>{tr.estBand}</div>
            <div style={{ ...display, fontSize: 46, fontWeight: 800, lineHeight: 1.05 }}>{bandStr(r.overall)}</div>
            <div className="text-xs mt-1" style={{ color: "#FFE3E6" }}>{promptSel ? promptSel.title : ""} · {wc} {tr.words}</div>
          </div>
          <Trophy size={40} style={{ color: "#FFD3D8", flexShrink: 0 }} />
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
        {CRIT.map(([k, label], i) => {
          const cr = r[k] || {};
          return (
            <div key={k} className="py-2" style={{ borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">{label}</span>
                <span className="text-sm font-bold" style={{ color: C.blue }}>{bandStr(cr.band)}</span>
              </div>
              <MiniBar pct={typeof cr.band === "number" ? (cr.band / 9) * 100 : 0} />
              {cr.comment && <p className="text-xs mt-1.5 leading-relaxed" style={{ color: C.sub }}>{cr.comment}</p>}
            </div>
          );
        })}
      </div>

      {((r.strengths && r.strengths.length > 0) || (r.improvements && r.improvements.length > 0)) && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          {r.strengths && r.strengths.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-bold mb-1.5" style={{ ...display, color: C.green }}>{tr.workingWell}</div>
              {r.strengths.map((s2, i) => (
                <div key={i} className="flex gap-2 text-sm py-0.5 leading-relaxed">
                  <Check size={16} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} /><span>{s2}</span>
                </div>
              ))}
            </div>
          )}
          {r.improvements && r.improvements.length > 0 && (
            <div>
              <div className="text-sm font-bold mb-1.5" style={{ ...display, color: C.amber }}>{tr.focusNext}</div>
              {r.improvements.map((s2, i) => (
                <div key={i} className="flex gap-2 text-sm py-0.5 leading-relaxed">
                  <ArrowRight size={16} style={{ color: C.amber, flexShrink: 0, marginTop: 2 }} /><span>{s2}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {Array.isArray(r.errors) && r.errors.length > 0 && (
        <div className="rounded-2xl p-4 mb-3" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div className="text-sm font-bold mb-2" style={{ ...display }}>{tr.fixFirst}</div>
          <div className="flex flex-col gap-3">
            {r.errors.map((e2, i) => {
              const u = e2 && e2.unit ? UNITS.find(x => x.id === e2.unit) : null;
              return (
                <div key={i} className="rounded-xl p-3" style={{ background: C.paper }}>
                  <div className="text-sm" style={{ color: C.red, textDecoration: "line-through" }}>{e2.original}</div>
                  <div className="text-sm font-semibold" style={{ color: C.green }}>→ {e2.fixed}</div>
                  {e2.rule && <div className="text-xs mt-1" style={{ color: C.sub }}>{e2.rule}</div>}
                  {u && (
                    <button onClick={() => goUnit(u.id)} className="mt-2 rounded-full px-3 py-1 text-xs font-bold"
                      style={{ background: C.blueWash, color: C.blue, border: "none", cursor: "pointer" }}>
                      {tr.review(u.id, u.title)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl p-3 mb-4 flex gap-2 text-xs leading-relaxed" style={{ background: C.amberWash, color: "#8A5A08" }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{tr.disclaimer}</span>
      </div>

      <div className="flex flex-col gap-2">
        <Btn tone="red" onClick={() => setPhase("pick")} full><PenLine size={16} /> {tr.another}</Btn>
        <Btn tone="ghost" onClick={onBack} full>{tr.backHome}</Btn>
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeUnit, setActiveUnit] = useState(null);
  const [progress, setProgress] = useState({});
  const [history, setHistory] = useState([]);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    (async () => {
      const p = await store.get(K_PROG);
      const w = await store.get(K_WRIT);
      const l = await store.get(K_LANG);
      if (p) setProgress(p);
      if (Array.isArray(w)) setHistory(w);
      if (l === "id" || l === "en") setLang(l);
    })();
  }, []);

  const changeLang = (l) => { setLang(l); store.set(K_LANG, l); };
  const openUnit = (id) => { setActiveUnit(id); setScreen("unit"); };

  const saveScore = (key, score, total) => {
    setProgress(prev => {
      const old = prev[key];
      const next = { ...prev, [key]: { best: Math.max(old ? old.best : 0, score), total, attempts: (old ? old.attempts : 0) + 1 } };
      store.set(K_PROG, next);
      return next;
    });
  };

  const addWriting = (entry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 20);
      store.set(K_WRIT, next);
      return next;
    });
  };

  const unit = UNITS.find(u => u.id === activeUnit);

  return (
    <Shell>
      <div className="flex justify-end mb-3">
        <LangToggle lang={lang} setLang={changeLang} />
      </div>
      {screen === "home" && (
        <HomeScreen progress={progress} history={history} openUnit={openUnit} openWriting={() => setScreen("writing")} lang={lang} />
      )}
      {screen === "unit" && unit && (
        <UnitScreen key={unit.id} unit={unit} progress={progress} onScore={saveScore} onBack={() => setScreen("home")} lang={lang} />
      )}
      {screen === "writing" && (
        <WritingLab onBack={() => setScreen("home")} onSave={addWriting} history={history} goUnit={openUnit} lang={lang} />
      )}
    </Shell>
  );
}
