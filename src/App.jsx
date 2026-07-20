import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft, BookOpen, PenLine, Check, X, RotateCcw, Trophy, Clock,
  Loader2, Lightbulb, ArrowRight, AlertTriangle, Sparkles, History, Play, Layers
} from "lucide-react";

// The Writing Lab calls the Anthropic API with platform-injected auth, which a
// static GitHub Pages site cannot provide (and a public site cannot safely hold
// an API key). It is disabled on this build; flip to true behind a backend proxy.
const AI_ENABLED = false;
const EXTRA_ROUND = 10; // questions served per shuffled Extra-practice round

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

// ---------- Persistence (localStorage; progress stays on this device) ----------
const K_PROG = "igr-progress";
const K_WRIT = "igr-writing";
const store = {
  async get(key) {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      const v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  },
  async set(key, val) {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      window.localStorage.setItem(key, JSON.stringify(val));
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

// ---------- Extra practice (Oxford 3000-level bank; served in shuffled rounds) ----------
// Written for this app and adversarially checked for a single defensible answer.
const QUIZ3 = {
  1: [
    { q: "There is ___ new café next to my office.", opts: ["the","a","an","Ø (no article)"], a: 1, ex: "'There is a...' introduces something new and non-specific; 'café' starts with a consonant.", exId: "'There is a...' memperkenalkan hal baru/non-spesifik; 'café' diawali konsonan, jadi 'a'." },
    { q: "It takes about ___ hour to fly from Jakarta to Bali.", opts: ["a","an","the","Ø (no article)"], a: 1, ex: "'Hour' has a silent 'h', so it starts with a vowel sound: an hour.", exId: "'Hour' huruf 'h'-nya bisu, jadi berbunyi awal vokal: an hour." },
    { q: "I read the news on ___ internet every morning.", opts: ["a","an","the","Ø (no article)"], a: 2, ex: "'The internet' is unique, so it always takes 'the'.", exId: "'The internet' bersifat unik, jadi selalu pakai 'the'." },
    { q: "___ money is important, but it cannot buy happiness.", opts: ["The","A","Ø (no article)","An"], a: 2, ex: "Uncountable nouns used in general take no article: money in general.", exId: "Kata benda tak terhitung dalam arti umum tanpa artikel: 'money' secara umum." },
    { q: "Which sentence is correct?", opts: ["She is a engineer.","She is an engineer.","She is engineer."], a: 1, ex: "Jobs need a/an; use 'an' before the vowel sound in 'engineer'.", exId: "Profesi butuh a/an; pakai 'an' sebelum bunyi vokal pada 'engineer'." },
    { q: "My sister is ___ university student in London.", opts: ["a","an","the","Ø (no article)"], a: 0, ex: "'University' begins with a /juː/ sound, a consonant sound, so use 'a' not 'an'.", exId: "'University' berbunyi awal /yu/ (konsonan), jadi pakai 'a', bukan 'an' walau hurufnya vokal." },
    { q: "There is ___ ATM near the station where you can get cash.", opts: ["a","the","an","Ø (no article)"], a: 2, ex: "'ATM' is said /eɪ-tiː-em/, starting with a vowel sound, so use 'an'.", exId: "'ATM' dibaca /ei/-tii-em, diawali bunyi vokal, jadi pakai 'an'." },
    { q: "This is ___ best restaurant in our neighbourhood.", opts: ["a","the","an","Ø (no article)"], a: 1, ex: "Use 'the' before superlatives like 'best' — there is only one best.", exId: "Pakai 'the' sebelum superlative seperti 'best' — hanya ada satu yang terbaik." },
    { q: "We travelled to ___ Japan last summer for a holiday.", opts: ["the","a","Ø (no article)","an"], a: 2, ex: "Most country names take no article: Japan, France, Indonesia.", exId: "Sebagian besar nama negara tanpa artikel: Japan, France, Indonesia." },
    { q: "I get paid once ___ month.", opts: ["a","the","an","Ø (no article)"], a: 0, ex: "Use 'a' to mean 'per' or 'each' with time: once a month.", exId: "'a' berarti 'per/setiap' untuk waktu: once a month (sekali sebulan)." },
    { q: "My phone has ___ app that helps me study English.", opts: ["an","the","a","Ø (no article)"], a: 0, ex: "'App' starts with a vowel sound, so use 'an'; first mention, non-specific.", exId: "'App' diawali bunyi vokal, pakai 'an'; penyebutan pertama, non-spesifik." },
    { q: "I bought a shirt and a tie. ___ shirt was quite expensive.", opts: ["A","An","The","Ø (no article)"], a: 2, ex: "Second mention: we already know which shirt, so use 'the'.", exId: "Penyebutan kedua: kita sudah tahu kemeja yang mana, jadi pakai 'the'." },
    { q: "She speaks ___ English very well.", opts: ["the","a","Ø (no article)","an"], a: 2, ex: "Languages take no article: speak English, French, Spanish.", exId: "Nama bahasa tanpa artikel: speak English." },
    { q: "Which sentence is correct?", opts: ["I go to work by car.","I go to work by the car.","I go to work by a car."], a: 0, ex: "'By car' (transport method) takes no article: by car, by bus, by train.", exId: "'By car' (cara transportasi) tanpa artikel: by car, by bus, by train." },
    { q: "Do you have ___ car, or do you take the bus to work?", opts: ["the","a","an","Ø (no article)"], a: 1, ex: "'A car' = one, any car (do you own one?); car starts with a consonant.", exId: "'A car' = sebuah mobil (non-spesifik); diawali konsonan, pakai 'a'." },
    { q: "I need to send ___ important email before lunch.", opts: ["an","a","the","Ø (no article)"], a: 0, ex: "'Important' starts with a vowel sound, so use 'an'; first mention, not specific.", exId: "'Important' diawali bunyi vokal, pakai 'an'; penyebutan pertama, non-spesifik." },
    { q: "London is ___ capital of England.", opts: ["a","an","the","Ø (no article)"], a: 2, ex: "Use 'the' for a unique thing defined by 'of': the capital of England.", exId: "Pakai 'the' untuk hal unik yang dijelaskan 'of': the capital of England." },
    { q: "___ computers have changed the way we work.", opts: ["The","A","An","Ø (no article)"], a: 3, ex: "Plural nouns used in general take no article: computers in general.", exId: "Kata benda jamak dalam arti umum tanpa artikel: 'computers' secara umum." },
    { q: "I'd like ___ cup of coffee, please.", opts: ["a","the","an","Ø (no article)"], a: 0, ex: "'A cup of coffee' = one, non-specific; cup starts with a consonant.", exId: "'A cup of coffee' = secangkir (non-spesifik); 'cup' diawali konsonan, pakai 'a'." },
    { q: "My father is ___ honest man; he never lies.", opts: ["a","an","the","Ø (no article)"], a: 1, ex: "'Honest' has a silent 'h' and a vowel sound, so use 'an'.", exId: "'Honest' huruf 'h'-nya bisu (bunyi vokal), jadi pakai 'an'." },
    { q: "My office is on ___ second floor of the building.", opts: ["a","the","an","Ø (no article)"], a: 1, ex: "Use 'the' before ordinals; 'the second floor' is one specific floor.", exId: "Pakai 'the' sebelum ordinal; 'the second floor' adalah lantai tertentu." },
    { q: "I usually have ___ breakfast at seven o'clock.", opts: ["a","the","an","Ø (no article)"], a: 3, ex: "Meals take no article: have breakfast, lunch, dinner.", exId: "Nama waktu makan tanpa artikel: have breakfast, lunch, dinner." },
    { q: "Which sentence is correct?", opts: ["The Mount Everest is the highest mountain.","Mount Everest is highest mountain.","Mount Everest is the highest mountain."], a: 2, ex: "Proper names take no article; superlatives take 'the': the highest mountain.", exId: "Nama diri tanpa artikel; superlative pakai 'the': the highest mountain." },
    { q: "My laptop is quite old, so I want to buy ___ new one.", opts: ["the","an","a","Ø (no article)"], a: 2, ex: "First mention of a non-specific singular thing; 'new' starts with a consonant.", exId: "Penyebutan pertama benda tunggal non-spesifik; 'new' diawali konsonan, pakai 'a'." },
    { q: "I bought ___ umbrella because it started to rain.", opts: ["a","an","the","Ø (no article)"], a: 1, ex: "'Umbrella' starts with a vowel sound, so use 'an'; non-specific one.", exId: "'Umbrella' diawali bunyi vokal, pakai 'an'; benda non-spesifik." },
    { q: "What is ___ cheapest way to travel around Europe?", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "Use 'the' before superlatives like 'cheapest' — only one is cheapest.", exId: "Pakai 'the' sebelum superlative seperti 'cheapest' — hanya satu yang termurah." },
    { q: "My children go to ___ school by bus every morning.", opts: ["a","the","Ø (no article)","an"], a: 2, ex: "'Go to school' means attend as a student — no article.", exId: "'Go to school' berarti bersekolah sebagai murid — tanpa artikel." },
    { q: "I always keep ___ pen in my bag for taking notes.", opts: ["a","an","the","Ø (no article)"], a: 0, ex: "'A pen' = any pen, non-specific; pen starts with a consonant sound.", exId: "'A pen' = pena apa saja (non-spesifik); diawali konsonan, pakai 'a'." },
    { q: "She works in ___ office, not in a shop.", opts: ["the","an","a","Ø (no article)"], a: 1, ex: "'Office' starts with a vowel sound; 'an office' = a workplace, non-specific.", exId: "'Office' diawali bunyi vokal; 'an office' = tempat kerja non-spesifik." },
    { q: "She is ___ first person to arrive at the office every day.", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "Use 'the' before ordinals like 'first' — it points to one specific position.", exId: "Pakai 'the' sebelum ordinal seperti 'first' — menunjuk satu posisi tertentu." },
    { q: "___ students often use their phones to take notes.", opts: ["The","Ø (no article)","A","An"], a: 1, ex: "Plural nouns in general take no article: students in general.", exId: "Kata benda jamak umum tanpa artikel: 'students' secara umum." },
    { q: "Which sentence is correct?", opts: ["I need an information about the course.","I need information about the course.","I need a information about the course."], a: 1, ex: "'Information' is uncountable, so no 'a' or 'an' — use no article.", exId: "'Information' tak terhitung, tanpa 'a'/'an' — pakai tanpa artikel." },
    { q: "We stayed at ___ small hotel during our trip to Bali.", opts: ["an","a","the","Ø (no article)"], a: 1, ex: "First mention of a non-specific hotel; 'hotel' has a consonant sound.", exId: "Penyebutan pertama hotel non-spesifik; 'hotel' berbunyi /h/ (konsonan), pakai 'a'." },
    { q: "Can I ask you ___ easy question about the homework?", opts: ["a","the","an","Ø (no article)"], a: 2, ex: "'Easy' starts with a vowel sound, so use 'an'; the question is not specific.", exId: "'Easy' diawali bunyi vokal, pakai 'an'; pertanyaannya non-spesifik." },
    { q: "Could you send me ___ file we talked about in the meeting?", opts: ["a","the","an","Ø (no article)"], a: 1, ex: "The relative clause 'we talked about' makes the file specific, so use 'the'.", exId: "Anak kalimat 'we talked about' membuat file itu spesifik, jadi pakai 'the'." },
    { q: "I don't drink ___ coffee because it keeps me awake.", opts: ["a","the","an","Ø (no article)"], a: 3, ex: "Uncountable nouns in general take no article: coffee here means coffee generally.", exId: "Kata benda tak terhitung secara umum tanpa artikel: 'coffee' di sini umum." },
    { q: "She wants to be ___ doctor when she grows up.", opts: ["an","the","a","Ø (no article)"], a: 2, ex: "Use 'a' before a consonant sound; jobs need a/an.", exId: "Pakai 'a' sebelum bunyi konsonan; profesi butuh a/an. 'Doctor' diawali konsonan." },
    { q: "He drives at sixty kilometres ___ hour on the motorway.", opts: ["an","a","the","Ø (no article)"], a: 0, ex: "'An hour' means 'per hour'; 'hour' has a silent 'h' (vowel sound).", exId: "'An hour' = 'per jam'; 'hour' berbunyi awal vokal (h bisu)." },
    { q: "You always make ___ same mistake when writing essays.", opts: ["a","the","an","Ø (no article)"], a: 1, ex: "'The same' is a fixed phrase; 'same' always takes 'the'.", exId: "'The same' adalah frasa tetap; 'same' selalu pakai 'the'." },
    { q: "I paid for the tickets with ___ cash, not a card.", opts: ["a","the","Ø (no article)","an"], a: 2, ex: "'With cash' is uncountable, used generally, so no article.", exId: "'With cash' tak terhitung dan umum, jadi tanpa artikel." },
    { q: "Which sentence is correct?", opts: ["The sun is very bright today.","A sun is very bright today.","Sun is very bright today."], a: 0, ex: "'The sun' is unique, so it always takes 'the'.", exId: "'The sun' unik, jadi selalu pakai 'the'." },
    { q: "This app is ___ useful tool for learning new words.", opts: ["an","a","the","Ø (no article)"], a: 1, ex: "'Useful' starts with a /juː/ consonant sound, so use 'a' not 'an'.", exId: "'Useful' berbunyi awal /yu/ (konsonan), jadi pakai 'a', bukan 'an'." },
    { q: "We had ___ amazing time on holiday in Thailand.", opts: ["the","a","an","Ø (no article)"], a: 2, ex: "'Amazing' starts with a vowel sound; 'have an amazing time' is a common phrase.", exId: "'Amazing' diawali bunyi vokal; 'have an amazing time' frasa umum, pakai 'an'." },
    { q: "The office is at ___ end of the street.", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "Use 'the' when 'of the street' makes it specific: the end of the street.", exId: "Pakai 'the' karena 'of the street' membuatnya spesifik." },
    { q: "He gave me ___ advice about my career.", opts: ["an","a","the","Ø (no article)"], a: 3, ex: "'Advice' is uncountable, so it takes no article and never 'an'.", exId: "'Advice' tak terhitung, tanpa artikel dan tidak pernah 'an advice'." },
    { q: "Who is ___ manager of this shop? I want to complain.", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "'Of this shop' makes the manager specific and unique, so use 'the'.", exId: "'Of this shop' membuat manajer itu spesifik dan unik, jadi pakai 'the'." },
    { q: "___ time goes quickly when you are busy at work.", opts: ["The","A","Ø (no article)","An"], a: 2, ex: "'Time' as a general idea is uncountable and takes no article.", exId: "'Time' sebagai gagasan umum tak terhitung, tanpa artikel." },
    { q: "Which sentence is correct?", opts: ["He is best student in the class.","He is a best student in the class.","He is the best student in the class."], a: 2, ex: "Superlatives take 'the': the best student.", exId: "Superlative pakai 'the': the best student." },
    { q: "There is ___ supermarket near our house, so shopping is easy.", opts: ["a","an","the","Ø (no article)"], a: 0, ex: "Use a to introduce one new singular countable noun, as after 'there is'.", exId: "Pakai a untuk memperkenalkan satu kata benda tunggal yang baru disebut." },
    { q: "The Earth moves around ___ sun.", opts: ["a","the","an","Ø (no article)"], a: 1, ex: "The sun is unique, only one exists, so use the.", exId: "Matahari itu unik, hanya ada satu, jadi pakai the." },
    { q: "My aunt works as ___ nurse in a big hospital.", opts: ["the","an","a","Ø (no article)"], a: 2, ex: "Use a before a job name with a consonant sound.", exId: "Pakai a sebelum nama pekerjaan yang diawali bunyi konsonan." },
    { q: "Which sentence is correct?", opts: ["It was an easy question.","It was a easy question.","It was easy question."], a: 0, ex: "Use an before a vowel sound; 'easy' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'easy' diawali bunyi vokal." },
    { q: "For a snack, I had ___ orange.", opts: ["a","an","the","Ø (no article)"], a: 1, ex: "Use an before a vowel sound; 'orange' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'orange' diawali bunyi vokal." },
    { q: "___ water is necessary for all living things.", opts: ["A","The","Ø (no article)","An"], a: 2, ex: "Uncountable nouns used in a general sense take no article.", exId: "Kata benda tak terhitung yang bermakna umum tidak memakai article." },
    { q: "We watched ___ good film at the cinema last night.", opts: ["an","the","Ø (no article)","a"], a: 3, ex: "Use a for a non-specific thing mentioned for the first time.", exId: "Pakai a untuk benda tak spesifik yang baru pertama disebut." },
    { q: "Which sentence is correct?", opts: ["We waited for a hour.","We waited for the hour.","We waited for an hour."], a: 2, ex: "'Hour' has a silent h and a vowel sound, so use an.", exId: "'Hour' huruf h-nya bisu dan berbunyi vokal, jadi pakai an." },
    { q: "Please close ___ door; it is cold in here.", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "Use the for a specific thing both speakers already know.", exId: "Pakai the untuk benda spesifik yang sudah diketahui kedua orang." },
    { q: "We play ___ football in the park every weekend.", opts: ["a","Ø (no article)","the","an"], a: 1, ex: "Sports take no article after the verb 'play'.", exId: "Nama olahraga tidak memakai article setelah kata kerja 'play'." },
    { q: "We want to buy ___ new sofa for our living room.", opts: ["the","an","a","Ø (no article)"], a: 2, ex: "Use a for a new, non-specific item mentioned for the first time.", exId: "Pakai a untuk barang baru yang belum spesifik dan pertama disebut." },
    { q: "Once ___ day, she drinks a glass of warm milk.", opts: ["the","Ø (no article)","a","an"], a: 2, ex: "Use a to mean 'per', as in once a day.", exId: "Pakai a untuk arti 'per', seperti once a day (sekali sehari)." },
    { q: "Which sentence is correct?", opts: ["She gave me a good advice.","She gave me good advice.","She gave me an advice."], a: 1, ex: "'Advice' is uncountable, so it takes no a or an.", exId: "'Advice' tak terhitung (uncountable), jadi tidak pakai a atau an." },
    { q: "She gave me ___ cup of hot tea.", opts: ["an","the","Ø (no article)","a"], a: 3, ex: "Use a in the fixed phrase 'a cup of'.", exId: "Pakai a dalam frasa tetap 'a cup of' (secangkir)." },
    { q: "I found ___ egg in the fridge this morning.", opts: ["an","a","the","Ø (no article)"], a: 0, ex: "Use an before a vowel sound; 'egg' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'egg' diawali bunyi vokal." },
    { q: "___ dogs are very loyal animals.", opts: ["The","A","Ø (no article)","An"], a: 2, ex: "Plural nouns used in a general sense take no article.", exId: "Kata benda jamak yang bermakna umum tidak memakai article." },
    { q: "I am reading ___ interesting book about space.", opts: ["the","a","Ø (no article)","an"], a: 3, ex: "Use an before a vowel sound; 'interesting' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'interesting' diawali bunyi vokal." },
    { q: "Can you turn off ___ TV? Nobody is watching it.", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "Use the for the specific TV in the room.", exId: "Pakai the untuk TV spesifik yang ada di ruangan itu." },
    { q: "I don't have ___ pen. Can I borrow one?", opts: ["the","a","an","Ø (no article)"], a: 1, ex: "Use a for any non-specific one; 'one' shows it is not specific.", exId: "Pakai a untuk benda apa saja yang tak spesifik; 'one' menegaskannya." },
    { q: "He had ___ idea about how to fix the problem.", opts: ["a","the","an","Ø (no article)"], a: 2, ex: "Use an before a vowel sound; 'idea' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'idea' diawali bunyi vokal." },
    { q: "We had ___ rice and chicken for dinner.", opts: ["a","the","an","Ø (no article)"], a: 3, ex: "Uncountable food like rice takes no article here.", exId: "Makanan tak terhitung seperti rice tidak memakai article di sini." },
    { q: "We always keep milk in ___ fridge.", opts: ["the","a","an","Ø (no article)"], a: 0, ex: "Use the for the one fridge we both know in the kitchen.", exId: "Pakai the untuk satu-satunya kulkas di dapur yang sudah diketahui." },
    { q: "We saw ___ elephant and some monkeys at the zoo.", opts: ["a","an","the","Ø (no article)"], a: 1, ex: "Use an before a vowel sound; 'elephant' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'elephant' diawali bunyi vokal." },
    { q: "My son goes to ___ bed at nine every night.", opts: ["the","a","Ø (no article)","an"], a: 2, ex: "'Go to bed' is a fixed phrase with no article.", exId: "'Go to bed' adalah frasa tetap tanpa article." },
    { q: "Which sentence is correct?", opts: ["We take a same bus every morning.","We take the same bus every morning.","We take same bus every morning."], a: 1, ex: "Always use the before the word 'same'.", exId: "Selalu pakai the sebelum kata 'same'." },
    { q: "I love ___ music, especially rock and pop.", opts: ["the","Ø (no article)","a","an"], a: 1, ex: "Uncountable nouns in a general sense take no article.", exId: "Kata benda tak terhitung yang bermakna umum tidak memakai article." },
    { q: "There is ___ university in our city.", opts: ["an","the","a","Ø (no article)"], a: 2, ex: "'University' sounds like 'you-', a consonant sound, so use a.", exId: "'University' berbunyi seperti 'yu-' (konsonan), jadi pakai a." },
    { q: "The bedroom is small, but ___ kitchen is quite big.", opts: ["a","an","Ø (no article)","the"], a: 3, ex: "Use the for a specific room; a home has one kitchen.", exId: "Pakai the untuk ruangan spesifik; satu rumah punya satu dapur." },
    { q: "He travels to ___ work by train every day.", opts: ["Ø (no article)","the","a","an"], a: 0, ex: "'Travel to work' is a fixed phrase with no article.", exId: "'Travel to work' adalah frasa tetap tanpa article." },
    { q: "I sent him ___ email this morning.", opts: ["a","an","the","Ø (no article)"], a: 1, ex: "Use an before a vowel sound; 'email' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'email' diawali bunyi vokal." },
    { q: "We have ___ small garden behind the house.", opts: ["the","an","a","Ø (no article)"], a: 2, ex: "Use a for a non-specific singular thing with a consonant sound.", exId: "Pakai a untuk benda tunggal tak spesifik yang diawali bunyi konsonan." },
    { q: "At ___ night, the city is very quiet.", opts: ["Ø (no article)","a","the","an"], a: 0, ex: "'At night' is a fixed phrase with no article.", exId: "'At night' adalah frasa tetap tanpa article." },
    { q: "Which sentence is correct?", opts: ["I never eat the breakfast.","I never eat a breakfast.","I never eat breakfast."], a: 2, ex: "Meal names like breakfast take no article.", exId: "Nama waktu makan seperti breakfast tidak memakai article." },
    { q: "This is ___ first time I have been to London.", opts: ["a","the","an","Ø (no article)"], a: 1, ex: "Use the with ordinal words like 'first'.", exId: "Pakai the dengan kata urutan (ordinal) seperti 'first'." },
    { q: "She is learning to cook ___ Italian food.", opts: ["an","a","Ø (no article)","the"], a: 2, ex: "Uncountable food in a general sense takes no article.", exId: "Makanan tak terhitung yang bermakna umum tidak memakai article." },
    { q: "I'd like ___ sandwich and a coffee, please.", opts: ["the","an","Ø (no article)","a"], a: 3, ex: "Use a for a non-specific singular thing with a consonant sound.", exId: "Pakai a untuk benda tunggal tak spesifik yang diawali bunyi konsonan." },
    { q: "My grandfather is ___ old man, but he is very active.", opts: ["an","a","the","Ø (no article)"], a: 0, ex: "Use an before a vowel sound; 'old' begins with one.", exId: "Pakai an sebelum bunyi vokal; 'old' diawali bunyi vokal." },
    { q: "After work, I like to take ___ long walk to relax.", opts: ["the","a","an","Ø (no article)"], a: 1, ex: "Use a in the phrase 'take a walk' for a non-specific walk.", exId: "Pakai a dalam frasa 'take a walk' untuk jalan-jalan yang tak spesifik." },
  ],
  2: [
    { q: "The news ___ always on at six o'clock in our house.", opts: ["are","is","were"], a: 1, ex: "News is an uncountable noun and takes a singular verb.", exId: "News adalah uncountable, jadi memakai kata kerja singular ('is')." },
    { q: "She gave me some useful ___ about the job interview.", opts: ["advice","advices","an advice"], a: 0, ex: "Advice is uncountable: no plural form and no 'a/an'.", exId: "Advice itu uncountable: tidak ada bentuk jamak dan tanpa 'a/an'." },
    { q: "Let me give you one important ___ of advice before you start.", opts: ["slice","bar","piece"], a: 2, ex: "Measure uncountable nouns with 'a piece of'.", exId: "Untuk menghitung noun uncountable pakai 'a piece of'." },
    { q: "The information on the website ___ very clear and easy to read.", opts: ["is","are","have"], a: 0, ex: "Information is uncountable and needs a singular verb.", exId: "Information uncountable, memakai kata kerja singular." },
    { q: "How ___ luggage are you taking with you on the flight?", opts: ["many","much","few"], a: 1, ex: "Use 'much' with uncountable nouns like luggage.", exId: "Pakai 'much' dengan uncountable seperti luggage." },
    { q: "We bought ___ new furniture for the office last month.", opts: ["any","a few","some"], a: 2, ex: "Use 'some' in positive sentences; furniture is uncountable.", exId: "Pakai 'some' di kalimat positif; furniture uncountable jadi bukan 'a few'." },
    { q: "There isn't ___ traffic on the roads today, so we'll arrive early.", opts: ["any","some","many"], a: 0, ex: "Use 'any' in negatives; traffic is uncountable.", exId: "Pakai 'any' di kalimat negatif; traffic uncountable." },
    { q: "Very ___ people came to the talk, so the room felt empty.", opts: ["little","few","much"], a: 1, ex: "'Few' = not enough, used with countable nouns.", exId: "'Few' berarti tidak cukup, dipakai dengan countable." },
    { q: "There is very ___ information available on this topic online.", opts: ["little","few","many"], a: 0, ex: "'Little' = not enough, used with uncountable nouns.", exId: "'Little' berarti tidak cukup, dipakai dengan uncountable." },
    { q: "Don't worry, we still have ___ time before the train leaves.", opts: ["a few","many","a little"], a: 2, ex: "'A little' = some and enough, with uncountable nouns.", exId: "'A little' berarti ada sedikit dan cukup, dengan uncountable." },
    { q: "He has ___ good friends he can always rely on.", opts: ["a little","a few","much"], a: 1, ex: "'A few' = some and enough, with countable nouns.", exId: "'A few' berarti ada beberapa dan cukup, dengan countable." },
    { q: "Which sentence is correct?", opts: ["He gave me a lot of information about the course.","He gave me many informations about the course.","He gave me many information about the course."], a: 0, ex: "Information is uncountable: use 'a lot of', not 'many' or a plural.", exId: "Information uncountable: pakai 'a lot of', bukan 'many' atau bentuk jamak." },
    { q: "The company spent ___ money on new office computers.", opts: ["a large amount of","a large number of","many"], a: 0, ex: "Use 'a large amount of' with uncountable nouns like money.", exId: "Pakai 'a large amount of' dengan uncountable seperti money." },
    { q: "There were ___ people waiting outside the shop this morning.", opts: ["a large amount of","much","a large number of"], a: 2, ex: "Use 'a large number of' with countable nouns like people.", exId: "Pakai 'a large number of' dengan countable seperti people." },
    { q: "I don't have ___ time to talk right now, sorry.", opts: ["many","much","a few"], a: 1, ex: "Use 'much' with uncountable 'time' in negatives.", exId: "Pakai 'much' dengan uncountable 'time' di kalimat negatif." },
    { q: "How ___ emails did you get this morning?", opts: ["many","much","a little"], a: 0, ex: "Use 'many' with countable nouns like emails.", exId: "Pakai 'many' dengan countable seperti emails." },
    { q: "Sorry, there are ___ seats left on this bus.", opts: ["any","much","no"], a: 2, ex: "'No' means zero and works with countable nouns here.", exId: "'No' berarti nol dan cocok dengan countable di sini." },
    { q: "Would you like ___ tea before you go?", opts: ["some","any","many"], a: 0, ex: "Use 'some' for offers, even in questions.", exId: "Pakai 'some' untuk tawaran, walau kalimatnya tanya." },
    { q: "Could I have ___ water, please?", opts: ["any","some","a few"], a: 1, ex: "Use 'some' for polite requests.", exId: "Pakai 'some' untuk permintaan sopan." },
    { q: "I haven't heard ___ news about your test results yet.", opts: ["any","some","many"], a: 0, ex: "Use 'any' in negatives; news is uncountable.", exId: "Pakai 'any' di kalimat negatif; news uncountable." },
    { q: "I need to buy some new ___ for the trip.", opts: ["luggages","a luggage","luggage"], a: 2, ex: "Luggage is uncountable: no plural and no 'a'.", exId: "Luggage uncountable: tanpa jamak dan tanpa 'a'." },
    { q: "The furniture in the new flat ___ very modern.", opts: ["is","are","were"], a: 0, ex: "Furniture is uncountable and takes a singular verb.", exId: "Furniture uncountable, memakai kata kerja singular." },
    { q: "I heard an exciting ___ of news on the radio this morning.", opts: ["cup","piece","sheet"], a: 1, ex: "Use 'a piece of' to count news.", exId: "Pakai 'a piece of' untuk menghitung news." },
    { q: "We didn't do ___ work during the holiday.", opts: ["much","many","a few"], a: 0, ex: "Use 'much' with uncountable 'work' in negatives.", exId: "Pakai 'much' dengan uncountable 'work' di negatif." },
    { q: "Which sentence is correct?", opts: ["There were too many furnitures in the room.","There were too much furniture in the room.","There was too much furniture in the room."], a: 2, ex: "Furniture is uncountable: 'much' + singular verb, no plural.", exId: "Furniture uncountable: 'much' + kata kerja singular, tanpa jamak." },
    { q: "There are ___ apps that can help you study English.", opts: ["much","a little","a lot of"], a: 2, ex: "'A lot of' works with countable nouns like apps.", exId: "'A lot of' cocok dengan countable seperti apps." },
    { q: "Take your time; we have ___ time before boarding.", opts: ["plenty of","many","a large number of"], a: 0, ex: "'Plenty of' means more than enough; time is uncountable.", exId: "'Plenty of' berarti lebih dari cukup; time uncountable." },
    { q: "I have very ___ money left, so I can't buy the phone.", opts: ["few","little","many"], a: 1, ex: "'Little' = not enough, with uncountable 'money'.", exId: "'Little' berarti tidak cukup, dengan uncountable 'money'." },
    { q: "The shop had very ___ customers today, so it closed early.", opts: ["few","little","much"], a: 0, ex: "'Few' = not enough, with countable 'customers'.", exId: "'Few' berarti tidak cukup, dengan countable 'customers'." },
    { q: "There is ___ milk left, so we can still make coffee.", opts: ["a few","many","a little"], a: 2, ex: "'A little' = some and enough, uncountable 'milk'.", exId: "'A little' berarti ada sedikit dan cukup, uncountable 'milk'." },
    { q: "There are ___ buses left tonight, so we can still get home.", opts: ["a few","a little","much"], a: 0, ex: "'A few' = some and enough, countable 'buses'.", exId: "'A few' berarti ada beberapa dan cukup, countable 'buses'." },
    { q: "Which sentence is correct?", opts: ["I need to do a research before the exam.","I need to do some research before the exam.","I need to do some researches before the exam."], a: 1, ex: "Research is uncountable: no 'a' and no plural.", exId: "Research uncountable: tanpa 'a' dan tanpa jamak." },
    { q: "The weather ___ very cold last week.", opts: ["was","were","are"], a: 0, ex: "Weather is uncountable and takes a singular verb.", exId: "Weather uncountable, memakai kata kerja singular ('was')." },
    { q: "The camera is an expensive ___ of equipment.", opts: ["bar","slice","piece"], a: 2, ex: "Use 'a piece of' to count equipment.", exId: "Pakai 'a piece of' untuk menghitung equipment." },
    { q: "She didn't give me ___ advice about the problem.", opts: ["some","any","many"], a: 1, ex: "Use 'any' in negatives; advice is uncountable.", exId: "Pakai 'any' di negatif; advice uncountable." },
    { q: "I found ___ useful information on that website.", opts: ["some","any","a few"], a: 0, ex: "Use 'some' in positive sentences; information is uncountable.", exId: "Pakai 'some' di kalimat positif; information uncountable." },
    { q: "How ___ money did you spend on the new laptop?", opts: ["many","a few","much"], a: 2, ex: "Use 'much' with uncountable 'money'.", exId: "Pakai 'much' dengan uncountable 'money'." },
    { q: "There aren't ___ trains after midnight.", opts: ["many","much","a little"], a: 0, ex: "Use 'many' with countable 'trains' in negatives.", exId: "Pakai 'many' dengan countable 'trains' di negatif." },
    { q: "Which sentence is correct?", opts: ["The weather was terrible during our trip.","The weather were terrible during our trip.","The weathers were terrible during our trip."], a: 0, ex: "Weather is uncountable: singular verb, no plural.", exId: "Weather uncountable: kata kerja singular, tanpa jamak." },
    { q: "My brother finished school and is now looking for ___ near the city centre.", opts: ["a work","work","works"], a: 1, ex: "'Work' (job) is uncountable: no 'a' and no plural.", exId: "'Work' (pekerjaan) uncountable: tanpa 'a' dan tanpa jamak." },
    { q: "The homework for tonight ___ quite difficult.", opts: ["is","are","were"], a: 0, ex: "Homework is uncountable and takes a singular verb.", exId: "Homework uncountable, memakai kata kerja singular." },
    { q: "The police found ___ evidence at the scene.", opts: ["a","many","some"], a: 2, ex: "Evidence is uncountable: use 'some', not 'a' or 'many'.", exId: "Evidence uncountable: pakai 'some', bukan 'a' atau 'many'." },
    { q: "Her knowledge of computers ___ really impressive.", opts: ["is","are","were"], a: 0, ex: "Knowledge is uncountable and needs a singular verb.", exId: "Knowledge uncountable, memakai kata kerja singular." },
    { q: "Which sentence is correct?", opts: ["She has a few work to finish tonight.","She has many work to finish tonight.","She has a little work to finish tonight."], a: 2, ex: "Work is uncountable: use 'a little', not 'a few' or 'many'.", exId: "Work uncountable: pakai 'a little', bukan 'a few' atau 'many'." },
    { q: "I searched the site but couldn't find ___ information about the flight.", opts: ["any","some","a"], a: 0, ex: "Use 'any' in negatives; information is uncountable (no 'a').", exId: "Pakai 'any' di negatif; information uncountable (tanpa 'a')." },
    { q: "Very ___ shops accept cash now, so bring your card.", opts: ["little","few","much"], a: 1, ex: "'Few' = not enough, with countable 'shops'.", exId: "'Few' berarti tidak cukup, dengan countable 'shops'." },
    { q: "Can I borrow ___ money until tomorrow?", opts: ["any","a few","some"], a: 2, ex: "Use 'some' for requests; money is uncountable.", exId: "Pakai 'some' untuk permintaan; money uncountable." },
    { q: "There isn't ___ water left in the bottle.", opts: ["much","many","a few"], a: 0, ex: "Use 'much' with uncountable 'water' in negatives.", exId: "Pakai 'much' dengan uncountable 'water' di negatif." },
    { q: "___ tourists visit this city every summer.", opts: ["Much","Many","A little"], a: 1, ex: "Use 'many' with countable 'tourists'.", exId: "Pakai 'many' dengan countable 'tourists'." },
    { q: "Which sentence is correct?", opts: ["There is a few milk left in the bottle.","There is a little milk left in the bottle.","There are a little milk left in the bottle."], a: 1, ex: "Milk is uncountable: 'a little' + singular verb.", exId: "Milk uncountable: 'a little' + kata kerja singular." },
    { q: "Don't rush; there are ___ seats on the train.", opts: ["much","a little","plenty of"], a: 2, ex: "'Plenty of' means more than enough; seats are countable.", exId: "'Plenty of' berarti lebih dari cukup; seats countable." },
    { q: "She has ___ experience working in hotels.", opts: ["a lot of","many","a few"], a: 0, ex: "Use 'a lot of' with uncountable 'experience'.", exId: "Pakai 'a lot of' dengan uncountable 'experience'." },
    { q: "This old table is my favourite ___ of furniture.", opts: ["slice","piece","cup"], a: 1, ex: "Use 'a piece of' to count furniture.", exId: "Pakai 'a piece of' untuk menghitung furniture." },
    { q: "There is ___ time to lose; the meeting starts now.", opts: ["no","any","many"], a: 0, ex: "'No' means zero; time is uncountable.", exId: "'No' berarti nol; time uncountable." },
    { q: "Which sentence is correct?", opts: ["I bought some new equipment for the kitchen.","I bought a new equipment for the kitchen.","I bought some new equipments for the kitchen."], a: 0, ex: "Equipment is uncountable: use 'some', no 'a', no plural.", exId: "Equipment uncountable: pakai 'some', tanpa 'a', tanpa jamak." },
    { q: "The ___ this morning is cold, so wear a warm jacket when you leave.", opts: ["weather","weathers","a weather"], a: 0, ex: "Weather is uncountable: no plural, no a/an.", exId: "Weather itu uncountable: tidak ada bentuk jamak, tidak pakai a/an." },
    { q: "There ___ a lot of traffic on this road during rush hour every day.", opts: ["is","are","were"], a: 0, ex: "Traffic is uncountable and takes a singular verb.", exId: "Traffic itu uncountable dan pakai kata kerja singular (is)." },
    { q: "Can you pass me a ___ of paper? I want to write down her address.", opts: ["piece","slice","glass"], a: 0, ex: "Use 'a piece of' for uncountable nouns like paper.", exId: "Pakai 'a piece of' untuk noun uncountable seperti paper." },
    { q: "Would you like ___ more rice? There is plenty left in the pot.", opts: ["much","some","many"], a: 1, ex: "Use 'some' in offers, even in question form.", exId: "Pakai 'some' untuk menawarkan sesuatu, walau bentuknya pertanyaan." },
    { q: "There isn't ___ milk left, so we can't make pancakes this morning.", opts: ["many","any","some"], a: 1, ex: "Use 'any' in negative sentences.", exId: "Pakai 'any' dalam kalimat negatif." },
    { q: "How ___ potatoes do we need to make the soup for six people?", opts: ["much","many","a little"], a: 1, ex: "Use 'many' with countable plural nouns like potatoes.", exId: "Pakai 'many' untuk noun countable jamak seperti potatoes." },
    { q: "There isn't ___ sugar in this cake, so it isn't very sweet.", opts: ["many","a few","much"], a: 2, ex: "Use 'much' with uncountable nouns in negatives.", exId: "Pakai 'much' untuk uncountable dalam kalimat negatif." },
    { q: "Only ___ people came to the park because it started to rain.", opts: ["a little","much","a few"], a: 2, ex: "'A few' = some, with countable plural nouns.", exId: "'A few' = beberapa, untuk countable jamak." },
    { q: "I've done very ___ exercise this month, so I feel quite unfit.", opts: ["little","few","many"], a: 0, ex: "'Little' = not enough, with uncountable nouns.", exId: "'Little' = tidak cukup, untuk uncountable." },
    { q: "___ shops were open on the holiday, so we couldn't buy much food.", opts: ["Few","Little","Much"], a: 0, ex: "'Few' = not enough, with countable plural nouns.", exId: "'Few' = tidak cukup, untuk countable jamak." },
    { q: "The police found a large ___ of evidence in the empty house.", opts: ["number","amount","few"], a: 1, ex: "'A large amount of' goes with uncountable nouns like evidence.", exId: "'A large amount of' untuk uncountable seperti evidence." },
    { q: "A large ___ of visitors come to the museum every weekend.", opts: ["amount","number","deal"], a: 1, ex: "'A large number of' goes with countable plural nouns.", exId: "'A large number of' untuk countable jamak." },
    { q: "She has ___ money, so she can't pay for the taxi home tonight.", opts: ["many","no","a few"], a: 1, ex: "'No' works with both nouns and fits the negative meaning.", exId: "'No' bisa untuk keduanya dan cocok dengan makna negatif." },
    { q: "Don't worry, we have ___ of chairs for all the guests.", opts: ["much","plenty","little"], a: 1, ex: "'Plenty of' = more than enough, with countable/uncountable.", exId: "'Plenty of' = lebih dari cukup, untuk countable/uncountable." },
    { q: "Which sentence is correct?", opts: ["The furnitures in the office look modern and clean.","The furniture in the office looks modern and clean.","The furniture in the office look modern and clean."], a: 1, ex: "Furniture is uncountable: singular verb, no plural.", exId: "Furniture uncountable: kata kerja singular, tanpa jamak." },
    { q: "There is ___ of bread, so make yourself a sandwich if you're hungry.", opts: ["many","a number","plenty"], a: 2, ex: "'Plenty of' fits uncountable 'bread'; 'many/a number' need plural.", exId: "'Plenty of' cocok untuk uncountable 'bread'." },
    { q: "How ___ homework do you have to finish before tomorrow morning?", opts: ["many","much","a few"], a: 1, ex: "Use 'much' with uncountable 'homework'.", exId: "Pakai 'much' untuk uncountable 'homework'." },
    { q: "There aren't ___ cafes near the station, so we had to walk far.", opts: ["much","many","a little"], a: 1, ex: "Use 'many' with countable plural nouns in negatives.", exId: "Pakai 'many' untuk countable jamak dalam kalimat negatif." },
    { q: "My coach gave me ___ piece of advice about staying calm before the match.", opts: ["a","an","some"], a: 0, ex: "Count advice with 'a piece of' (singular, use 'a').", exId: "Hitung advice dengan 'a piece of' (singular, pakai 'a')." },
    { q: "We don't have ___ furniture in the new flat yet, so it looks empty.", opts: ["many","much","a few"], a: 1, ex: "Use 'much' with uncountable 'furniture' in negatives.", exId: "Pakai 'much' untuk uncountable 'furniture' dalam kalimat negatif." },
    { q: "The new gym has ___ modern equipment for all its members.", opts: ["many","a few","a lot of"], a: 2, ex: "'A lot of' fits uncountable 'equipment'; 'many/a few' need plural.", exId: "'A lot of' cocok untuk uncountable 'equipment'." },
    { q: "She has a lot of ___ about healthy cooking after years of practice.", opts: ["knowledge","knowledges","a knowledge"], a: 0, ex: "Knowledge is uncountable: no plural, no a/an.", exId: "Knowledge uncountable: tanpa jamak, tanpa a/an." },
    { q: "The students are doing ___ into local food markets for their project.", opts: ["research","researches","a research"], a: 0, ex: "Research is uncountable: no plural, no a/an.", exId: "Research uncountable: tanpa jamak, tanpa a/an." },
    { q: "I have too ___ work today, so I can't meet you for lunch.", opts: ["many","much","a few"], a: 1, ex: "'Work' (job/tasks) is uncountable: use 'much'.", exId: "'Work' (pekerjaan) uncountable: pakai 'much'." },
    { q: "There is only ___ water in the bottle, but it's enough for the walk.", opts: ["a few","a little","many"], a: 1, ex: "'A little' with uncountable 'water' = some, enough.", exId: "'A little' untuk uncountable 'water' = sedikit, cukup." },
    { q: "We have very ___ time, so we must leave for the airport right now.", opts: ["few","little","many"], a: 1, ex: "'Little' = not enough, with uncountable 'time'.", exId: "'Little' = tidak cukup, untuk uncountable 'time'." },
    { q: "Do you need ___ help carrying those heavy bags up the stairs?", opts: ["many","a","any"], a: 2, ex: "Use 'any' with uncountable 'help' in a question.", exId: "Pakai 'any' untuk uncountable 'help' dalam pertanyaan." },
    { q: "The website didn't give ___ information about the opening hours.", opts: ["some","any","many"], a: 1, ex: "Use 'any' in negative sentences.", exId: "Pakai 'any' dalam kalimat negatif." },
    { q: "There are ___ oranges in the fridge if you want one for a snack.", opts: ["any","much","some"], a: 2, ex: "Use 'some' in positive sentences with plural nouns.", exId: "Pakai 'some' dalam kalimat positif dengan noun jamak." },
    { q: "I have ___ close friends in this city, so I sometimes feel lonely.", opts: ["few","little","much"], a: 0, ex: "'Few' = not enough, with countable plural nouns.", exId: "'Few' = tidak cukup, untuk countable jamak." },
    { q: "Luckily ___ neighbours helped me carry the heavy sofa inside.", opts: ["a little","a few","much"], a: 1, ex: "'A few' = some, enough, with countable plural nouns.", exId: "'A few' = beberapa (cukup), untuk countable jamak." },
    { q: "Which sentence is correct?", opts: ["There are too much traffic in the city centre today.","There is too many traffic in the city centre today.","There is too much traffic in the city centre today."], a: 2, ex: "Traffic is uncountable: singular verb and 'much', not 'many'.", exId: "Traffic uncountable: kata kerja singular dan 'much', bukan 'many'." },
    { q: "There is ___ bread on the shelf, so we don't need to buy more.", opts: ["a","many","some"], a: 2, ex: "Use 'some' with uncountable 'bread' in positive sentences.", exId: "Pakai 'some' untuk uncountable 'bread' dalam kalimat positif." },
  ],
  3: [
    { q: "You can rely ___ this app to wake you up on time.", opts: ["to","on","of"], a: 1, ex: "rely on = trust someone or something to do a job.", exId: "rely on = mengandalkan sesuatu atau seseorang." },
    { q: "It is hard to concentrate ___ studying when your phone keeps buzzing.", opts: ["on","at","in"], a: 0, ex: "concentrate on = give all your attention to something.", exId: "concentrate on = memusatkan perhatian pada sesuatu." },
    { q: "We had to wait ___ the train for twenty minutes this morning.", opts: ["to","on","for"], a: 2, ex: "wait for = stay until someone or something comes.", exId: "wait for = menunggu sesuatu atau seseorang." },
    { q: "He decided to apply ___ a new job in the city.", opts: ["to","for","on"], a: 1, ex: "apply for = officially ask for a job or place.", exId: "apply for = melamar atau mengajukan permohonan untuk sesuatu." },
    { q: "The team spent all week preparing ___ the big presentation.", opts: ["of","to","for"], a: 2, ex: "prepare for = get yourself ready for something.", exId: "prepare for = mempersiapkan diri untuk sesuatu." },
    { q: "I have been looking ___ a cheaper phone plan online.", opts: ["for","in","on"], a: 0, ex: "look for = try to find something.", exId: "look for = mencari sesuatu." },
    { q: "Try not to worry ___ the exam; you have studied hard.", opts: ["of","for","about"], a: 2, ex: "worry about = feel anxious over something.", exId: "worry about = khawatir tentang sesuatu." },
    { q: "I need some time to think ___ your offer before I decide.", opts: ["on","about","for"], a: 1, ex: "think about = consider something in your mind.", exId: "think about = memikirkan atau mempertimbangkan sesuatu." },
    { q: "Every day the support team must deal ___ many customer problems.", opts: ["with","of","to"], a: 0, ex: "deal with = handle or manage something.", exId: "deal with = menangani atau mengurus sesuatu." },
    { q: "It can be difficult to cope ___ so much work before a deadline.", opts: ["to","with","for"], a: 1, ex: "cope with = manage a difficult situation.", exId: "cope with = mengatasi atau menghadapi sesuatu." },
    { q: "Please listen ___ the safety instructions before the flight.", opts: ["at","for","to"], a: 2, ex: "listen to = pay attention to a sound or speaker.", exId: "listen to = mendengarkan sesuatu." },
    { q: "In his report he referred ___ last year's sales figures.", opts: ["at","to","on"], a: 1, ex: "refer to = mention or talk about something.", exId: "refer to = merujuk atau menyebut sesuatu." },
    { q: "Many office workers suffer ___ headaches after too much screen time.", opts: ["from","of","with"], a: 0, ex: "suffer from = experience an illness or problem.", exId: "suffer from = menderita suatu penyakit atau masalah." },
    { q: "Prices at the airport differ greatly ___ prices in town.", opts: ["to","from","with"], a: 1, ex: "differ from = be different from something.", exId: "differ from = berbeda dari sesuatu." },
    { q: "The tour package consists ___ flights, hotels and meals.", opts: ["from","in","of"], a: 2, ex: "consist of = be made up of these parts.", exId: "consist of = terdiri dari beberapa bagian." },
    { q: "If you want to pass, you must believe ___ your own ability.", opts: ["on","in","at"], a: 1, ex: "believe in = have confidence in something.", exId: "believe in = percaya atau yakin pada sesuatu." },
    { q: "The tourist pointed ___ the tall tower across the river.", opts: ["on","at","of"], a: 1, ex: "point at = show something with your finger.", exId: "point at = menunjuk ke sesuatu." },
    { q: "She has always been interested ___ how computers work.", opts: ["in","on","for"], a: 0, ex: "interested in = wanting to know more about something.", exId: "interested in = tertarik pada sesuatu." },
    { q: "As the manager, he is responsible ___ the whole team.", opts: ["of","for","to"], a: 1, ex: "responsible for = in charge of something.", exId: "responsible for = bertanggung jawab atas sesuatu." },
    { q: "With her degree, she is well qualified ___ this role.", opts: ["to","of","for"], a: 2, ex: "qualified for = having the right skills for something.", exId: "qualified for = memenuhi syarat untuk sesuatu." },
    { q: "The city is famous ___ its cheap and delicious food.", opts: ["of","with","for"], a: 2, ex: "famous for = well known because of something.", exId: "famous for = terkenal karena sesuatu." },
    { q: "This little car is capable ___ a very long journey.", opts: ["to","of","for"], a: 1, ex: "capable of = able to do something.", exId: "capable of = mampu melakukan sesuatu." },
    { q: "Some travellers are afraid ___ flying in bad weather.", opts: ["of","from","for"], a: 0, ex: "afraid of = frightened by something.", exId: "afraid of = takut akan sesuatu." },
    { q: "Are you aware ___ the hidden fees on this ticket?", opts: ["to","of","in"], a: 1, ex: "aware of = knowing that something exists.", exId: "aware of = sadar atau mengetahui akan sesuatu." },
    { q: "They are very proud ___ their son's exam results.", opts: ["with","for","of"], a: 2, ex: "proud of = pleased about an achievement.", exId: "proud of = bangga akan sesuatu." },
    { q: "Customers were very satisfied ___ the quick delivery service.", opts: ["of","with","to"], a: 1, ex: "satisfied with = happy about something.", exId: "satisfied with = puas dengan sesuatu." },
    { q: "The teacher was pleased ___ the students' progress this term.", opts: ["with","of","for"], a: 0, ex: "pleased with = happy about something or someone.", exId: "pleased with = senang dengan sesuatu." },
    { q: "After a month, she became familiar ___ the new office system.", opts: ["to","with","of"], a: 1, ex: "familiar with = knowing something well.", exId: "familiar with = akrab atau terbiasa dengan sesuatu." },
    { q: "He is worried ___ missing the last bus home tonight.", opts: ["of","for","about"], a: 2, ex: "worried about = anxious about something.", exId: "worried about = khawatir tentang sesuatu." },
    { q: "The children are really excited ___ the trip to the zoo.", opts: ["of","about","to"], a: 1, ex: "excited about = feeling happy about a future event.", exId: "excited about = bersemangat tentang sesuatu." },
    { q: "Many students are curious ___ how the app was built.", opts: ["about","of","for"], a: 0, ex: "curious about = wanting to learn about something.", exId: "curious about = penasaran tentang sesuatu." },
    { q: "I am really bad ___ remembering people's phone numbers.", opts: ["at","on","with"], a: 0, ex: "bad at = not skilled at an activity.", exId: "bad at = buruk atau tidak pandai dalam sesuatu." },
    { q: "Your new laptop looks very similar ___ mine.", opts: ["to","with","as"], a: 0, ex: "similar to = almost the same as something.", exId: "similar to = mirip dengan sesuatu." },
    { q: "There has been a big increase ___ the price of fuel.", opts: ["in","of","on"], a: 0, ex: "increase in = a rise in amount or number.", exId: "increase in = kenaikan dalam sesuatu." },
    { q: "The chart shows a rise ___ the number of online shoppers.", opts: ["of","in","for"], a: 1, ex: "rise in = an increase in something.", exId: "rise in = kenaikan dalam sesuatu." },
    { q: "There was a sharp fall ___ ticket sales after the price rise.", opts: ["in","of","to"], a: 0, ex: "fall in = a drop in amount or number.", exId: "fall in = penurunan dalam sesuatu." },
    { q: "The company reported a decrease ___ profits this year.", opts: ["of","in","on"], a: 1, ex: "decrease in = a reduction in something.", exId: "decrease in = penurunan dalam sesuatu." },
    { q: "New technology has a huge impact ___ the way we work.", opts: ["to","in","on"], a: 2, ex: "impact on = a strong effect on something.", exId: "impact on = dampak terhadap sesuatu." },
    { q: "Too much sugar can have a bad effect ___ your health.", opts: ["in","on","for"], a: 1, ex: "effect on = a result or change on something.", exId: "effect on = pengaruh atau efek terhadap sesuatu." },
    { q: "Advertising has a strong influence ___ what people buy.", opts: ["on","to","of"], a: 0, ex: "influence on = the power to affect something.", exId: "influence on = pengaruh terhadap sesuatu." },
    { q: "In summer there is a huge demand ___ cheap flights.", opts: ["of","for","on"], a: 1, ex: "demand for = many people wanting something.", exId: "demand for = permintaan akan sesuatu." },
    { q: "There is a real need ___ better public transport in this city.", opts: ["of","to","for"], a: 2, ex: "need for = a situation where something is required.", exId: "need for = kebutuhan akan sesuatu." },
    { q: "The main reason ___ the delay was the heavy rain.", opts: ["of","for","to"], a: 1, ex: "reason for = why something happens.", exId: "reason for = alasan atau penyebab sesuatu." },
    { q: "Scientists are still searching for a solution ___ this problem.", opts: ["to","of","for"], a: 0, ex: "solution to = a way to solve a problem.", exId: "solution to = solusi untuk sesuatu." },
    { q: "Hard work is often the key ___ success in any career.", opts: ["of","to","for"], a: 1, ex: "key to = the most important thing for achieving something.", exId: "key to = kunci menuju sesuatu." },
    { q: "One advantage ___ online shopping is the lower prices.", opts: ["to","for","of"], a: 2, ex: "advantage of = a good point about something.", exId: "advantage of = keuntungan atau kelebihan dari sesuatu." },
    { q: "Her fear ___ heights stops her from climbing the tower.", opts: ["for","of","to"], a: 1, ex: "fear of = being afraid of something.", exId: "fear of = ketakutan akan sesuatu." },
    { q: "The project failed because of a lack ___ money.", opts: ["of","in","for"], a: 0, ex: "lack of = not having enough of something.", exId: "lack of = kekurangan atau ketiadaan sesuatu." },
    { q: "Which sentence is correct?", opts: ["Our trip depends of the weather.","Our trip depends on the weather.","Our trip depends to the weather."], a: 1, ex: "depend on = an outcome decided by something.", exId: "depend on = tergantung pada sesuatu." },
    { q: "Which sentence is correct?", opts: ["My sister is good at drawing cartoons.","My sister is good in drawing cartoons.","My sister is good on drawing cartoons."], a: 0, ex: "good at = skilled at an activity.", exId: "good at = pandai dalam suatu keterampilan." },
    { q: "Which sentence is correct?", opts: ["This model is very different with the old one.","This model is very different of the old one.","This model is very different from the old one."], a: 2, ex: "different from = not the same as something.", exId: "different from = berbeda dari sesuatu." },
    { q: "Which sentence is correct?", opts: ["Stress is a common cause of headaches.","Stress is a common cause for headaches.","Stress is a common cause to headaches."], a: 0, ex: "cause of = the thing that produces a result.", exId: "cause of = penyebab dari sesuatu." },
    { q: "Which sentence is correct?", opts: ["I don't know the answer for this question.","I don't know the answer to this question.","I don't know the answer of this question."], a: 1, ex: "answer to = a reply to a question or problem.", exId: "answer to = jawaban untuk sesuatu." },
    { q: "Which sentence is correct?", opts: ["This phone belongs to my brother.","This phone belongs for my brother.","This phone belongs at my brother."], a: 0, ex: "belong to = be owned by someone.", exId: "belong to = milik seseorang." },
    { q: "Our weekend plans depend ___ the weather; if it rains, we will stay at home.", opts: ["at","on","for"], a: 1, ex: "Use 'depend on' for this verb + preposition.", exId: "'Depend on' = 'bergantung pada'; selalu pakai 'on'." },
    { q: "You can rely ___ me to bring the drinks to the picnic.", opts: ["on","to","in"], a: 0, ex: "'Rely on' means to trust or count on someone.", exId: "'Rely on' = 'mengandalkan'; pakai 'on'." },
    { q: "Please turn off the TV so I can concentrate ___ my homework.", opts: ["in","at","on"], a: 2, ex: "'Concentrate on' = focus your attention on something.", exId: "'Concentrate on' = 'berkonsentrasi pada'; pakai 'on'." },
    { q: "My grandmother always insists ___ paying for dinner when we eat out.", opts: ["on","for","to"], a: 0, ex: "'Insist on' + noun or -ing form.", exId: "'Insist on' = 'bersikeras'; diikuti 'on' + kata benda/V-ing." },
    { q: "She wants to apply ___ a job at the new cafe in town.", opts: ["for","to","on"], a: 0, ex: "'Apply for' a job, course, or place.", exId: "'Apply for' = 'melamar'; untuk pekerjaan pakai 'for'." },
    { q: "The team trained hard to prepare ___ the big match on Sunday.", opts: ["to","of","for"], a: 2, ex: "'Prepare for' an event or exam.", exId: "'Prepare for' = 'bersiap untuk'; pakai 'for'." },
    { q: "After a week of rain, we are all hoping ___ some sunshine.", opts: ["for","to","at"], a: 0, ex: "'Hope for' a good result or thing.", exId: "'Hope for' = 'berharap akan'; pakai 'for'." },
    { q: "I am looking ___ my keys; have you seen them anywhere?", opts: ["at","in","for"], a: 2, ex: "'Look for' means to search for something.", exId: "'Look for' = 'mencari'; pakai 'for'." },
    { q: "Don't worry ___ the mess; we can clean the kitchen later.", opts: ["for","about","of"], a: 1, ex: "'Worry about' a problem or person.", exId: "'Worry about' = 'khawatir tentang'; pakai 'about'." },
    { q: "She really cares ___ the environment and always recycles at home.", opts: ["of","to","about"], a: 2, ex: "'Care about' means something matters to you.", exId: "'Care about' = 'peduli pada'; pakai 'about'." },
    { q: "A good manager knows how to deal ___ difficult customers calmly.", opts: ["with","to","on"], a: 0, ex: "'Deal with' a problem or person.", exId: "'Deal with' = 'menangani'; pakai 'with'." },
    { q: "Every morning I listen ___ music while I make breakfast.", opts: ["at","to","on"], a: 1, ex: "'Listen to' music, the radio, or a person.", exId: "'Listen to' = 'mendengarkan'; pakai 'to'." },
    { q: "This umbrella belongs ___ my sister; she left it by the door.", opts: ["with","to","for"], a: 1, ex: "'Belong to' shows who owns something.", exId: "'Belong to' = 'milik'; pakai 'to'." },
    { q: "In her talk, the doctor often referred ___ her own research.", opts: ["to","at","on"], a: 0, ex: "'Refer to' means to mention or point to.", exId: "'Refer to' = 'merujuk pada'; pakai 'to'." },
    { q: "Wear a hat to protect your skin ___ the strong afternoon sun.", opts: ["of","from","for"], a: 1, ex: "'Protect someone from' danger or harm.", exId: "'Protect from' = 'melindungi dari'; pakai 'from'." },
    { q: "My coach believes ___ me even when I lose a match.", opts: ["in","on","at"], a: 0, ex: "'Believe in' someone means to trust them.", exId: "'Believe in' = 'percaya pada'; pakai 'in'." },
    { q: "The little boy laughed and pointed ___ the funny clown.", opts: ["on","in","at"], a: 2, ex: "'Point at' something to show it with a finger.", exId: "'Point at' = 'menunjuk ke'; pakai 'at'." },
    { q: "Which sentence is correct?", opts: ["The dinner consists in rice and grilled fish.","She suffers from bad headaches every winter.","This team differs of last year's team."], a: 1, ex: "'Suffer from' an illness; also 'consist of', 'differ from'.", exId: "'Suffer from' = 'menderita', pakai 'from'. Juga 'consist of', 'differ from'." },
    { q: "Which sentence is correct?", opts: ["A healthy salad consists of fresh vegetables.","He always shouts to me when he is angry.","I could not cope of so much homework."], a: 0, ex: "'Consist of' parts; also 'shout at', 'cope with'.", exId: "'Consist of' = 'terdiri dari', pakai 'of'. Juga 'shout at', 'cope with'." },
    { q: "My daughter is very interested ___ learning to play the guitar.", opts: ["on","in","at"], a: 1, ex: "'Interested in' a subject or activity.", exId: "'Interested in' = 'tertarik pada'; pakai 'in'." },
    { q: "He was very successful ___ growing vegetables in his small garden.", opts: ["in","for","on"], a: 0, ex: "'Successful in' doing something.", exId: "'Successful in' = 'berhasil dalam'; pakai 'in'." },
    { q: "The oldest brother is responsible ___ locking the doors at night.", opts: ["of","for","to"], a: 1, ex: "'Responsible for' a task or duty.", exId: "'Responsible for' = 'bertanggung jawab atas'; pakai 'for'." },
    { q: "With her new diploma, she is now qualified ___ the nursing job.", opts: ["for","to","in"], a: 0, ex: "'Qualified for' a job or role.", exId: "'Qualified for' = 'memenuhi syarat untuk'; pakai 'for'." },
    { q: "This little town is famous ___ its fresh cheese and warm bread.", opts: ["by","of","for"], a: 2, ex: "'Famous for' what makes a place known.", exId: "'Famous for' = 'terkenal karena'; pakai 'for'." },
    { q: "I think you are capable ___ passing this exam if you study hard.", opts: ["to","for","of"], a: 2, ex: "'Capable of' + -ing form.", exId: "'Capable of' = 'mampu'; pakai 'of' + V-ing." },
    { q: "My little sister is afraid ___ the dark, so we leave a light on.", opts: ["from","of","for"], a: 1, ex: "'Afraid of' something that scares you.", exId: "'Afraid of' = 'takut pada'; pakai 'of'." },
    { q: "Drivers should be aware ___ children playing near the road.", opts: ["on","about","of"], a: 2, ex: "'Aware of' means knowing something exists.", exId: "'Aware of' = 'sadar akan'; pakai 'of'." },
    { q: "My parents are very proud ___ me for finishing the whole race.", opts: ["for","with","of"], a: 2, ex: "'Proud of' a person or achievement.", exId: "'Proud of' = 'bangga pada'; pakai 'of'." },
    { q: "The customers were satisfied ___ the meal and the friendly service.", opts: ["of","for","with"], a: 2, ex: "'Satisfied with' a result or service.", exId: "'Satisfied with' = 'puas dengan'; pakai 'with'." },
    { q: "The teacher was pleased ___ our project on healthy food.", opts: ["of","with","at"], a: 1, ex: "'Pleased with' something or someone.", exId: "'Pleased with' = 'senang dengan'; pakai 'with'." },
    { q: "Are you familiar ___ this part of the city, or shall I guide you?", opts: ["with","to","for"], a: 0, ex: "'Familiar with' means you know it well.", exId: "'Familiar with' = 'akrab/paham dengan'; pakai 'with'." },
    { q: "The doctor is worried ___ my father's high blood pressure.", opts: ["for","about","of"], a: 1, ex: "'Worried about' a person or problem.", exId: "'Worried about' = 'cemas tentang'; pakai 'about'." },
    { q: "The children are excited ___ their trip to the beach tomorrow.", opts: ["about","in","from"], a: 0, ex: "'Excited about' a future event.", exId: "'Excited about' = 'bersemangat tentang'; pakai 'about'." },
    { q: "My mother is very good ___ making soup from leftover vegetables.", opts: ["in","at","for"], a: 1, ex: "'Good at' a skill or activity.", exId: "'Good at' = 'pandai dalam'; pakai 'at'." },
  ],
  4: [
    { q: "My new laptop is ___ than my old one; it starts up in seconds.", opts: ["the fastest","more fast","faster"], a: 2, ex: "Short adjectives add -er + than to compare two things.", exId: "Kata sifat pendek ditambah -er + than untuk membandingkan dua hal." },
    { q: "The bus was ___ than usual this morning, so I was late for work.", opts: ["slow","slower","slowest"], a: 1, ex: "Use a short adjective + -er + than to compare two things.", exId: "Gunakan kata sifat pendek + -er + than untuk membandingkan dua hal." },
    { q: "This backpack is ___ than that one, so it's easier to carry.", opts: ["the lightest","lighter","more light"], a: 1, ex: "Short adjective + -er + than compares two items.", exId: "Kata sifat pendek + -er + than membandingkan dua benda." },
    { q: "The city centre is ___ than the suburbs, especially at night.", opts: ["noisier","more noisy","noisiest"], a: 0, ex: "Adjectives ending in -y change to -ier + than.", exId: "Kata sifat berakhiran -y berubah jadi -ier + than." },
    { q: "Plane tickets are ___ than they were last summer, so I booked early.", opts: ["cheaper","more cheap","cheapest"], a: 0, ex: "Short adjective + -er + than compares two prices.", exId: "Kata sifat pendek + -er + than membandingkan dua harga." },
    { q: "The second exam felt ___ than the first, but I still passed.", opts: ["hard","harder","hardest"], a: 1, ex: "Use -er + than to compare two things.", exId: "Gunakan -er + than untuk membandingkan dua hal." },
    { q: "My old phone was ___ than this one; the screen was tiny.", opts: ["smaller","more small","smallest"], a: 0, ex: "Short adjective + -er + than for two things.", exId: "Kata sifat pendek + -er + than untuk dua hal." },
    { q: "The new office is ___ to the station than our last one.", opts: ["closer","more close","closest"], a: 0, ex: "Short adjective + -er + than compares two distances.", exId: "Kata sifat pendek + -er + than membandingkan dua jarak." },
    { q: "This phone is ___ than the one I bought last year.", opts: ["expensiver","most expensive","more expensive"], a: 2, ex: "Long adjectives use more + adjective + than, not -er.", exId: "Kata sifat panjang pakai more + adjective + than, bukan -er." },
    { q: "Learning grammar is ___ than memorising new words, I think.", opts: ["difficulter","more difficult","the most difficult"], a: 1, ex: "Long adjectives take more + adjective + than.", exId: "Kata sifat panjang memakai more + adjective + than." },
    { q: "The train is ___ than driving when the roads are busy.", opts: ["more convenient","convenienter","most convenient"], a: 0, ex: "Use more + long adjective + than to compare two options.", exId: "Gunakan more + kata sifat panjang + than untuk dua pilihan." },
    { q: "This laptop is ___ than the older model, so the battery lasts longer.", opts: ["powerfuller","more powerful","most powerful"], a: 1, ex: "Long adjectives use more + adjective + than.", exId: "Kata sifat panjang pakai more + adjective + than." },
    { q: "Working from home is ___ than commuting every day.", opts: ["more relaxing","relaxinger","the most relaxing"], a: 0, ex: "More + long adjective + than compares two situations.", exId: "More + kata sifat panjang + than membandingkan dua situasi." },
    { q: "Our team meetings are ___ than they were before the new manager.", opts: ["more productive","productiver","most productive"], a: 0, ex: "More + long adjective + than to compare two things.", exId: "More + kata sifat panjang + than untuk membandingkan dua hal." },
    { q: "Traffic is ___ today than it was yesterday, so I arrived on time.", opts: ["gooder","better","best"], a: 1, ex: "Good becomes better (irregular), not gooder.", exId: "Good menjadi better (tidak beraturan), bukan gooder." },
    { q: "The signal here is ___ than at the office; my calls keep dropping.", opts: ["worser","more bad","worse"], a: 2, ex: "Bad becomes worse (irregular).", exId: "Bad menjadi worse (tidak beraturan)." },
    { q: "The new station is ___ from my house than the old one.", opts: ["further","furtherer","more far"], a: 0, ex: "Far becomes further/farther (irregular).", exId: "Far menjadi further/farther (tidak beraturan)." },
    { q: "My exam results this term were ___ than last term.", opts: ["more good","better","gooder"], a: 1, ex: "Good becomes better, never 'more good'.", exId: "Good menjadi better, jangan pernah 'more good'." },
    { q: "The weather on our trip was ___ than we had hoped; it rained daily.", opts: ["badder","worse","more worse"], a: 1, ex: "Bad becomes worse; never add more or -er twice.", exId: "Bad menjadi worse; jangan tambah more atau -er dua kali." },
    { q: "If you have any ___ questions, please email me after class.", opts: ["further","farther","furtherer"], a: 0, ex: "Further means 'more/additional' for non-distance meanings.", exId: "Further berarti 'tambahan' untuk makna bukan jarak." },
    { q: "This chair is good, but that one is ___ for my back.", opts: ["better","gooder","more good"], a: 0, ex: "Good becomes better (irregular).", exId: "Good menjadi better (tidak beraturan)." },
    { q: "Which sentence is correct?", opts: ["This bag is more cheaper than that one.","This bag is cheaper than that one.","This bag is more cheap than that one."], a: 1, ex: "Never use 'more' and '-er' together; cheap becomes cheaper.", exId: "Jangan gabung 'more' dan '-er'; cheap menjadi cheaper." },
    { q: "This route is ___ than that one, so we'll get there sooner.", opts: ["shorter","more shorter","more short"], a: 0, ex: "Short adjectives use -er only, never 'more' too.", exId: "Kata sifat pendek pakai -er saja, jangan tambah 'more'." },
    { q: "Which sentence uses grammar correctly?", opts: ["Today's weather is far worser than yesterday.","Today's weather is far worse than yesterday.","Today's weather is far more worse than yesterday."], a: 1, ex: "Bad becomes worse; strengthen with 'far', never double it.", exId: "Bad menjadi worse; perkuat dengan 'far', jangan diganda." },
    { q: "Her second essay was ___ than her first one.", opts: ["more better","better","gooder"], a: 1, ex: "Better already means 'more good'; don't add 'more'.", exId: "Better sudah berarti 'more good'; jangan tambah 'more'." },
    { q: "This suitcase is ___ than mine; you packed a lot.", opts: ["heavier","more heavier","more heavy"], a: 0, ex: "Short adjective + -er only; never double it with 'more'.", exId: "Kata sifat pendek + -er saja; jangan ganda dengan 'more'." },
    { q: "Of all three phones in the shop, this one has ___ battery.", opts: ["a longer","the longest","longer"], a: 1, ex: "For three or more, use the + -est (superlative).", exId: "Untuk tiga hal atau lebih, pakai the + -est (superlatif)." },
    { q: "This is ___ hotel of the five we found online.", opts: ["more comfortable","comfortabler","the most comfortable"], a: 2, ex: "Long adjectives: the most + adjective for groups of 3+.", exId: "Kata sifat panjang: the most + adjective untuk 3+ hal." },
    { q: "Monday is ___ day of the week for our whole team.", opts: ["busier","the busiest","most busy"], a: 1, ex: "Superlative -est with 'the' for the top of a group.", exId: "Superlatif -est dengan 'the' untuk yang teratas dalam grup." },
    { q: "That was ___ interesting lecture I have ever attended.", opts: ["the most","more","most"], a: 0, ex: "Use 'the most' + adjective for the highest in a group.", exId: "Gunakan 'the most' + adjective untuk yang tertinggi dalam grup." },
    { q: "Among all my subjects, maths is ___ to understand.", opts: ["the hardest","harder","most hard"], a: 0, ex: "Superlative the + -est for three or more items.", exId: "Superlatif the + -est untuk tiga hal atau lebih." },
    { q: "This shop has ___ prices in the entire mall.", opts: ["the lowest","lower","most low"], a: 0, ex: "Use the + -est for the top of a large group.", exId: "Gunakan the + -est untuk yang teratas dalam grup besar." },
    { q: "It's ___ city I have ever visited, with towers everywhere.", opts: ["the most modern","more modern","modernest"], a: 0, ex: "Long adjective superlative: the most + adjective.", exId: "Superlatif kata sifat panjang: the most + adjective." },
    { q: "Which sentence is correct English?", opts: ["It is most useful app of the three.","It is the usefulest app of the three.","It is the most useful app of the three."], a: 2, ex: "Long adjectives: the most + adjective, not '-est'.", exId: "Kata sifat panjang: the most + adjective, bukan '-est'." },
    { q: "My commute is ___ as yours; we both travel about an hour.", opts: ["longer","as long","the longest"], a: 1, ex: "as + adjective + as shows two things are equal.", exId: "as + adjective + as menunjukkan dua hal sama." },
    { q: "This cafe is ___ as the one near the station; the coffee is weaker.", opts: ["not as good","not as better","not gooder"], a: 0, ex: "not as + adjective + as means less than the other.", exId: "not as + adjective + as berarti kurang dari yang lain." },
    { q: "The film was ___ as the book; both were excellent.", opts: ["more enjoyable","enjoyabler","as enjoyable"], a: 2, ex: "as + adjective + as for equal qualities.", exId: "as + adjective + as untuk kualitas yang sama." },
    { q: "Trains here are not ___ as they are in Japan; ours run late.", opts: ["as punctual","punctualer","more punctual"], a: 0, ex: "not as + adjective + as shows one is less.", exId: "not as + adjective + as menunjukkan yang satu kurang." },
    { q: "This new plan is ___ as the last one; nothing has really changed.", opts: ["simpler","as simple","the simplest"], a: 1, ex: "as + adjective + as for two equal things.", exId: "as + adjective + as untuk dua hal yang sama." },
    { q: "The exam wasn't ___ as I feared; I finished with time to spare.", opts: ["difficulter","as difficult","more difficult"], a: 1, ex: "not as + adjective + as means less than expected.", exId: "not as + adjective + as berarti kurang dari perkiraan." },
    { q: "Choose the correct sentence.", opts: ["This chair is as comfortable than that one.","This chair is as comfortable as that one.","This chair is so comfortable as that one."], a: 1, ex: "Equality uses 'as + adjective + as', not 'than' or 'so'.", exId: "Kesamaan pakai 'as + adjective + as', bukan 'than' atau 'so'." },
    { q: "The express train is ___ faster than the bus, so I always take it.", opts: ["much","more","very"], a: 0, ex: "much/far + comparative makes the difference bigger.", exId: "much/far + komparatif membuat perbedaannya lebih besar." },
    { q: "Online shopping is ___ cheaper than driving to the mall.", opts: ["very","far","most"], a: 1, ex: "far + comparative strengthens the comparison.", exId: "far + komparatif memperkuat perbandingan." },
    { q: "This model is ___ more expensive than that one, only a dollar or two.", opts: ["slightly","far","much"], a: 0, ex: "slightly means a small difference before a comparative.", exId: "slightly berarti perbedaan kecil sebelum komparatif." },
    { q: "Sales were ___ higher this month after we cut the prices.", opts: ["significant","significantly","more significant"], a: 1, ex: "Use the adverb 'significantly' before a comparative.", exId: "Gunakan kata keterangan 'significantly' sebelum komparatif." },
    { q: "The new road made my journey ___ shorter, saving me an hour.", opts: ["much","very","more"], a: 0, ex: "much + comparative shows a big difference.", exId: "much + komparatif menunjukkan perbedaan besar." },
    { q: "Prices rose only a little, so rent is ___ higher than last year.", opts: ["far","slightly","much"], a: 1, ex: "slightly + comparative shows a small change.", exId: "slightly + komparatif menunjukkan perubahan kecil." },
    { q: "___ you practise speaking, the more confident you become.", opts: ["The more","More","The most"], a: 0, ex: "Double comparative: The more..., the more... .", exId: "Komparatif ganda: The more..., the more... ." },
    { q: "The faster you type, ___ work you finish before lunch.", opts: ["the more","more","the most"], a: 0, ex: "Second half of the double comparative uses 'the more'.", exId: "Bagian kedua komparatif ganda pakai 'the more'." },
    { q: "Which one is grammatically correct?", opts: ["The more you save, the more you have.","More you save, more you have.","The more you save, the most you have."], a: 0, ex: "Pattern: The + comparative..., the + comparative... .", exId: "Pola: The + komparatif..., the + komparatif... ." },
    { q: "The cheaper the flights are, ___ people book them.", opts: ["the more","more","the most"], a: 0, ex: "Both halves of a double comparative start with 'the'.", exId: "Kedua bagian komparatif ganda diawali 'the'." },
    { q: "This is our ___ plan for cutting costs this year.", opts: ["best","the best","most best"], a: 0, ex: "After a possessive (our), drop 'the' before a superlative.", exId: "Setelah kata milik (our), hilangkan 'the' sebelum superlatif." },
    { q: "She showed us her ___ design out of everything in her folder.", opts: ["the best","best","better"], a: 1, ex: "Possessive + superlative: no 'the' (her best).", exId: "Kata milik + superlatif: tanpa 'the' (her best)." },
    { q: "Pick the sentence that is correct.", opts: ["This is our the best offer of the day.","This is our most best offer of the day.","This is our best offer of the day."], a: 2, ex: "Drop 'the' after a possessive: our best offer.", exId: "Hilangkan 'the' setelah kata milik: our best offer." },
    { q: "My new flat is ___ than my old one.", opts: ["more big","bigger","biggest"], a: 1, ex: "Short adjectives: add -er + than to compare two things.", exId: "Kata sifat pendek: tambah -er + than untuk membandingkan dua hal." },
    { q: "The film last night was ___ than I expected.", opts: ["more boring","boringer","the most boring"], a: 0, ex: "Long adjectives: use more + adjective + than.", exId: "Kata sifat panjang: pakai more + adjective + than." },
    { q: "This coffee tastes ___ than the one from the machine.", opts: ["gooder","more good","better"], a: 2, ex: "'Good' becomes 'better', not 'gooder' or 'more good'.", exId: "'Good' menjadi 'better', bukan 'gooder' atau 'more good'." },
    { q: "My headache is ___ now than it was this morning.", opts: ["worse","worser","badder"], a: 0, ex: "'Bad' becomes 'worse', an irregular comparative.", exId: "'Bad' menjadi 'worse', comparative tidak beraturan." },
    { q: "Buying fruit at the market is ___ than at the shop.", opts: ["cheaper","more cheaper","most cheap"], a: 0, ex: "Never use 'more' with an -er form.", exId: "Jangan pakai 'more' dengan bentuk -er." },
    { q: "Of all my friends, Tom is ___.", opts: ["taller","the tallest","tall"], a: 1, ex: "For three or more, use the + -est.", exId: "Untuk tiga atau lebih, pakai the + -est." },
    { q: "That was ___ film I have ever seen.", opts: ["excitingest","more exciting","the most exciting"], a: 2, ex: "Long adjective superlative: the most + adjective.", exId: "Superlative kata sifat panjang: the most + adjective." },
    { q: "My sister is ___ me; we wear the same size.", opts: ["as tall as","taller than","the tallest"], a: 0, ex: "Use as + adjective + as for equal things.", exId: "Pakai as + adjective + as untuk hal yang sama." },
    { q: "This cafe is ___ the old one; it feels quite empty.", opts: ["not as busy as","busier than","as busy as"], a: 0, ex: "not as ... as means less than the other.", exId: "not as ... as berarti kurang dari yang lain." },
    { q: "After the medicine, I felt ___ better.", opts: ["much","more","very"], a: 0, ex: "Strengthen a comparative with much/far, not very.", exId: "Perkuat comparative dengan much/far, bukan very." },
    { q: "___ it gets, the more people come to the beach.", opts: ["The hotter","Hotter","The hottest"], a: 0, ex: "Double comparative: The + comparative, the + comparative.", exId: "Comparative ganda: The + comparative, the + comparative." },
    { q: "We think this is our ___ idea so far.", opts: ["best","the best","most best"], a: 0, ex: "After a possessive, drop 'the' before the superlative.", exId: "Setelah possessive, hilangkan 'the' sebelum superlative." },
    { q: "Today is ___ colder than yesterday, so bring a jacket.", opts: ["slightly","slight","the slightest"], a: 0, ex: "slightly + comparative shows a small difference.", exId: "slightly + comparative menunjukkan perbedaan kecil." },
    { q: "Walking to work is ___ healthier than driving.", opts: ["far","very","the most"], a: 0, ex: "Strengthen a comparative with far/much, not very.", exId: "Perkuat comparative dengan far/much, bukan very." },
    { q: "Since she started running, her times are ___ faster.", opts: ["significant","most","significantly"], a: 2, ex: "significantly + comparative shows a big difference.", exId: "significantly + comparative menunjukkan perbedaan besar." },
    { q: "The gym is ___ from my house than the park.", opts: ["farer","further","more far"], a: 1, ex: "'Far' becomes 'further' for distance.", exId: "'Far' menjadi 'further' untuk jarak." },
    { q: "In summer the days are ___ than in winter.", opts: ["longer","more long","longest"], a: 0, ex: "Short adjectives: add -er + than.", exId: "Kata sifat pendek: tambah -er + than." },
    { q: "This exercise is ___ than the last one.", opts: ["tiringer","the most tiring","more tiring"], a: 2, ex: "Long adjectives: use more + adjective + than.", exId: "Kata sifat panjang: pakai more + adjective + than." },
    { q: "Among the three routes, this one is ___.", opts: ["more direct","the most direct","directest"], a: 1, ex: "For three or more, use the most + long adjective.", exId: "Untuk tiga atau lebih, pakai the most + kata sifat panjang." },
    { q: "My new phone is ___ my old one; nothing has changed in speed.", opts: ["faster than","as fast as","the fastest"], a: 1, ex: "as + adjective + as shows two things are the same.", exId: "as + adjective + as menunjukkan dua hal sama." },
    { q: "This road is ___ than the motorway.", opts: ["more quicker","most quick","quicker"], a: 2, ex: "Don't mix 'more' with an -er form.", exId: "Jangan campur 'more' dengan bentuk -er." },
    { q: "Her second cake turned out ___ than the first.", opts: ["gooder","more good","better"], a: 2, ex: "The comparative of 'good' is 'better'.", exId: "Comparative dari 'good' adalah 'better'." },
    { q: "January is often ___ month of the year here.", opts: ["colder","most cold","the coldest"], a: 2, ex: "Superlative of a short adjective: the + -est.", exId: "Superlative kata sifat pendek: the + -est." },
    { q: "The book was ___ the film; I enjoyed the film much more.", opts: ["as good as","better than","not as good as"], a: 2, ex: "not as ... as means less than the other thing.", exId: "not as ... as berarti kurang dari hal yang lain." },
    { q: "With the new oven, baking is ___ easier.", opts: ["very","much","more"], a: 1, ex: "Use much (not very) to strengthen a comparative.", exId: "Pakai much (bukan very) untuk memperkuat comparative." },
    { q: "Summer is ___ the busiest season for our little shop.", opts: ["very","by far","more"], a: 1, ex: "'By far the' emphasises the superlative.", exId: "'By far the' menegaskan superlative." },
    { q: "The more you practise, ___ you become.", opts: ["better","the better","more better"], a: 1, ex: "Second part of double comparative: the + comparative.", exId: "Bagian kedua comparative ganda: the + comparative." },
    { q: "Grandma says this soup is her ___ dish.", opts: ["best","the best","goodest"], a: 0, ex: "After 'her', drop 'the' before the superlative.", exId: "Setelah 'her', hilangkan 'the' sebelum superlative." },
    { q: "This bag is ___ than mine.", opts: ["more heavy","heaviest","heavier"], a: 2, ex: "Short adjective + -er + than for comparison.", exId: "Kata sifat pendek + -er + than untuk perbandingan." },
    { q: "Living in the city is ___ than living in a village.", opts: ["expensiver","the most expensive","more expensive"], a: 2, ex: "Long adjectives: more + adjective + than.", exId: "Kata sifat panjang: more + adjective + than." },
    { q: "Of everyone in the team, Maria is ___.", opts: ["more careful","carefuller","the most careful"], a: 2, ex: "Superlative of a long adjective: the most + adjective.", exId: "Superlative kata sifat panjang: the most + adjective." },
    { q: "The second half of the match was ___ than the first.", opts: ["worser","worse","more bad"], a: 1, ex: "'Bad' becomes 'worse' in comparisons.", exId: "'Bad' menjadi 'worse' saat membandingkan." },
    { q: "This chair is ___ that one; they cost the same and feel the same.", opts: ["cheaper than","not as comfortable as","as comfortable as"], a: 2, ex: "as + adjective + as shows equality.", exId: "as + adjective + as menunjukkan kesamaan." },
    { q: "My new shoes are ___ tighter than my old ones.", opts: ["slightly","slight","most"], a: 0, ex: "slightly + comparative = a small amount more.", exId: "slightly + comparative = sedikit lebih." },
  ],
  5: [
    { q: "My manager ___ the team meeting every Monday morning.", opts: ["lead","leads","are leading"], a: 1, ex: "A singular subject takes a singular verb (verb + -s).", exId: "Subjek tunggal memakai kata kerja tunggal (verb + -s)." },
    { q: "This new app ___ my photos automatically to the cloud.", opts: ["saves","save","are saving"], a: 0, ex: "A singular subject takes a singular verb.", exId: "Subjek tunggal memakai kata kerja tunggal." },
    { q: "The office printer ___ new paper almost every day.", opts: ["need","are needing","needs"], a: 2, ex: "A singular subject takes a singular verb.", exId: "Subjek tunggal memakai kata kerja tunggal." },
    { q: "The two managers ___ in the same office downtown.", opts: ["work","works","is working"], a: 0, ex: "A plural subject takes a plural verb (no -s).", exId: "Subjek jamak memakai kata kerja jamak (tanpa -s)." },
    { q: "My colleagues ___ lunch at the same café every day.", opts: ["have","has","is having"], a: 0, ex: "A plural subject takes a plural verb.", exId: "Subjek jamak memakai kata kerja jamak." },
    { q: "These new phones ___ a lot of money in that shop.", opts: ["costs","is costing","cost"], a: 2, ex: "A plural subject takes a plural verb.", exId: "Subjek jamak memakai kata kerja jamak." },
    { q: "The manager and her assistant ___ the report together.", opts: ["writes","is writing","write"], a: 2, ex: "Two subjects joined by 'and' take a plural verb.", exId: "Dua subjek yang digabung dengan 'and' memakai kata kerja jamak." },
    { q: "My laptop and my phone ___ both in the black bag.", opts: ["is","are","was"], a: 1, ex: "Two subjects joined by 'and' take a plural verb.", exId: "Dua subjek yang digabung dengan 'and' memakai kata kerja jamak." },
    { q: "Tea and coffee ___ served free at the hotel breakfast.", opts: ["are","is","was"], a: 0, ex: "Two subjects joined by 'and' take a plural verb.", exId: "Dua subjek yang digabung dengan 'and' memakai kata kerja jamak." },
    { q: "Either the teachers or the principal ___ the final choice.", opts: ["make","are making","makes"], a: 2, ex: "With 'or', the verb agrees with the nearest subject.", exId: "Dengan 'or', kata kerja mengikuti subjek yang paling dekat." },
    { q: "Either the manager or the workers ___ going to fix it.", opts: ["are","is","was"], a: 0, ex: "With 'or', the verb agrees with the nearest subject.", exId: "Dengan 'or', kata kerja mengikuti subjek yang paling dekat." },
    { q: "Neither the students nor the teacher ___ ready for the test.", opts: ["are","is","were"], a: 1, ex: "With 'nor', the verb agrees with the nearest subject.", exId: "Dengan 'nor', kata kerja mengikuti subjek yang paling dekat." },
    { q: "Neither the teacher nor the students ___ on the bus now.", opts: ["is","was","are"], a: 2, ex: "With 'nor', the verb agrees with the nearest subject.", exId: "Dengan 'nor', kata kerja mengikuti subjek yang paling dekat." },
    { q: "Everyone in the office ___ a computer to use.", opts: ["have","has","are having"], a: 1, ex: "'Everyone' is singular and takes a singular verb.", exId: "'Everyone' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "Someone ___ left a phone on the front desk.", opts: ["has","have","are"], a: 0, ex: "'Someone' is singular and takes a singular verb.", exId: "'Someone' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "Each of the students ___ a locker in the hall.", opts: ["have","get","has"], a: 2, ex: "'Each of' is singular and takes a singular verb.", exId: "'Each of' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "Every phone in the shop ___ on sale today.", opts: ["is","are","were"], a: 0, ex: "'Every' is singular and takes a singular verb.", exId: "'Every' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "One of my friends ___ in London right now.", opts: ["live","are living","lives"], a: 2, ex: "'One of' is singular and takes a singular verb.", exId: "'One of' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "Somebody always ___ the meeting room door open.", opts: ["leave","leaves","are leaving"], a: 1, ex: "'Somebody' is singular and takes a singular verb.", exId: "'Somebody' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "A few of the passengers ___ still waiting at the gate.", opts: ["is","are","was"], a: 1, ex: "'A few' is plural and takes a plural verb.", exId: "'A few' bersifat jamak dan memakai kata kerja jamak." },
    { q: "Many students ___ the bus to school every day.", opts: ["take","takes","is taking"], a: 0, ex: "'Many' is plural and takes a plural verb.", exId: "'Many' bersifat jamak dan memakai kata kerja jamak." },
    { q: "Several of the phones ___ broken screens.", opts: ["have","has","is having"], a: 0, ex: "'Several' is plural and takes a plural verb.", exId: "'Several' bersifat jamak dan memakai kata kerja jamak." },
    { q: "Some of the workers ___ from other cities.", opts: ["comes","is coming","come"], a: 2, ex: "'Some of' follows the noun after 'of'; workers is plural.", exId: "'Some of' mengikuti kata benda setelah 'of'; 'workers' jamak." },
    { q: "Some of the water ___ leaked onto the office floor.", opts: ["have","has","were"], a: 1, ex: "'Some of' follows the noun after 'of'; water is uncountable.", exId: "'Some of' mengikuti kata benda setelah 'of'; 'water' uncountable." },
    { q: "All of the seats on the plane ___ taken already.", opts: ["is","was","are"], a: 2, ex: "'All of' follows the noun after 'of'; seats is plural.", exId: "'All of' mengikuti kata benda setelah 'of'; 'seats' jamak." },
    { q: "All of the money ___ gone from the account now.", opts: ["is","are","have"], a: 0, ex: "'All of' follows the noun after 'of'; money is uncountable.", exId: "'All of' mengikuti kata benda setelah 'of'; 'money' uncountable." },
    { q: "None of the information on the site ___ correct.", opts: ["are","is","were"], a: 1, ex: "'None of' with an uncountable noun takes a singular verb.", exId: "'None of' dengan kata benda uncountable memakai kata kerja tunggal." },
    { q: "Most of the tourists here ___ from Asia.", opts: ["are","is","was"], a: 0, ex: "'Most of' follows the noun after 'of'; tourists is plural.", exId: "'Most of' mengikuti kata benda setelah 'of'; 'tourists' jamak." },
    { q: "Most of the bread ___ still fresh this morning.", opts: ["are","is","were"], a: 1, ex: "'Most of' follows the noun after 'of'; bread is uncountable.", exId: "'Most of' mengikuti kata benda setelah 'of'; 'bread' uncountable." },
    { q: "The number of students in the class ___ rising fast.", opts: ["are","were","is"], a: 2, ex: "'The number of' is singular and takes a singular verb.", exId: "'The number of' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "A number of problems ___ been reported today.", opts: ["have","has","is"], a: 0, ex: "'A number of' means many, so it takes a plural verb.", exId: "'A number of' berarti banyak, jadi memakai kata kerja jamak." },
    { q: "There ___ a new café right next to the office.", opts: ["is","are","were"], a: 0, ex: "'There is/are' agrees with the subject that follows.", exId: "'There is/are' mengikuti subjek yang datang setelahnya." },
    { q: "There ___ many buses on this route in the morning.", opts: ["are","is","was"], a: 0, ex: "'There is/are' agrees with the subject that follows.", exId: "'There is/are' mengikuti subjek yang datang setelahnya." },
    { q: "There ___ some milk left in the office fridge.", opts: ["are","were","is"], a: 2, ex: "'There is/are' agrees with the subject; milk is uncountable.", exId: "'There is/are' mengikuti subjek; 'milk' uncountable, jadi tunggal." },
    { q: "The information on this page ___ very useful for the trip.", opts: ["are","is","were"], a: 1, ex: "Uncountable nouns take a singular verb.", exId: "Kata benda uncountable memakai kata kerja tunggal." },
    { q: "Traffic in the city centre ___ worse in the morning.", opts: ["are","get","is"], a: 2, ex: "Uncountable nouns take a singular verb.", exId: "Kata benda uncountable memakai kata kerja tunggal." },
    { q: "The furniture in the new office ___ modern and simple.", opts: ["is","are","were"], a: 0, ex: "Uncountable nouns take a singular verb.", exId: "Kata benda uncountable memakai kata kerja tunggal." },
    { q: "Her advice about saving money ___ always helpful.", opts: ["are","is","were"], a: 1, ex: "Uncountable nouns take a singular verb.", exId: "Kata benda uncountable memakai kata kerja tunggal." },
    { q: "Twenty dollars ___ too much for one short taxi ride.", opts: ["are","is","were"], a: 1, ex: "A sum of money is treated as one amount, so singular.", exId: "Jumlah uang dianggap satu nilai, jadi memakai kata kerja tunggal." },
    { q: "Mathematics ___ my favourite subject at school.", opts: ["are","were","is"], a: 2, ex: "'Mathematics' looks plural but takes a singular verb.", exId: "'Mathematics' terlihat jamak tetapi memakai kata kerja tunggal." },
    { q: "The United States ___ a very large country.", opts: ["are","is","were"], a: 1, ex: "A country name takes a singular verb.", exId: "Nama negara memakai kata kerja tunggal." },
    { q: "The results of the final test ___ ready to collect now.", opts: ["is","are","was"], a: 1, ex: "Ignore words between subject and verb; results is plural.", exId: "Abaikan kata di antara subjek dan verb; 'results' jamak." },
    { q: "The box of old phones ___ on the top shelf.", opts: ["are","is","were"], a: 1, ex: "Match the real subject 'box', not 'phones'; box is singular.", exId: "Cocokkan dengan subjek asli 'box', bukan 'phones'; 'box' tunggal." },
    { q: "The list of passengers ___ on the manager's desk.", opts: ["are","were","is"], a: 2, ex: "Match the real subject 'list', not 'passengers'; list is singular.", exId: "Cocokkan dengan subjek asli 'list', bukan 'passengers'; 'list' tunggal." },
    { q: "The prices of the train tickets ___ gone up this year.", opts: ["has","have","is"], a: 1, ex: "Match the real subject 'prices'; prices is plural.", exId: "Cocokkan dengan subjek asli 'prices'; 'prices' jamak." },
    { q: "The quality of the photos ___ improved a lot lately.", opts: ["has","have","were"], a: 0, ex: "Match the real subject 'quality'; quality is singular.", exId: "Cocokkan dengan subjek asli 'quality'; 'quality' tunggal." },
    { q: "Which sentence is correct about the tourists?", opts: ["The number of tourists have grown this year.","The number of tourists has grown this year.","The number of tourists are growing this year."], a: 1, ex: "'The number of' is singular and takes a singular verb.", exId: "'The number of' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "Which sentence is correct about the phones?", opts: ["Each of the phones come with a charger.","Each of the phones are coming with a charger.","Each of the phones comes with a charger."], a: 2, ex: "'Each of' is singular and takes a singular verb.", exId: "'Each of' bersifat tunggal dan memakai kata kerja tunggal." },
    { q: "Which sentence is correct about the bus stop?", opts: ["There is three buses at the stop.","There are three buses at the stop.","There be three buses at the stop."], a: 1, ex: "'There are' agrees with the plural subject 'buses'.", exId: "'There are' mengikuti subjek jamak 'buses'." },
    { q: "Which sentence is correct about the trip?", opts: ["My friend and I is going to Bali.","My friend and I am going to Bali.","My friend and I are going to Bali."], a: 2, ex: "Two subjects joined by 'and' take a plural verb.", exId: "Dua subjek yang digabung dengan 'and' memakai kata kerja jamak." },
    { q: "Which sentence is correct about the subject at school?", opts: ["Mathematics are difficult for me.","Mathematics is difficult for me.","Mathematics were difficult for me."], a: 1, ex: "'Mathematics' takes a singular verb.", exId: "'Mathematics' memakai kata kerja tunggal." },
    { q: "Which sentence is correct about the students today?", opts: ["A number of students was absent today.","A number of students were absent today.","A number of students is absent today."], a: 1, ex: "'A number of' is plural and takes a plural verb.", exId: "'A number of' bersifat jamak dan memakai kata kerja jamak." },
    { q: "Ten kilometres ___ a long way to walk to the office.", opts: ["are","were","is"], a: 2, ex: "A distance is treated as one amount, so it takes a singular verb.", exId: "Jarak dianggap satu nilai, jadi memakai kata kerja tunggal." },
    { q: "Everyone in my family ___ dinner together on Sundays.", opts: ["eat","eats","eating"], a: 1, ex: "'Everyone' is always singular, so use a singular verb.", exId: "'Everyone' selalu dianggap tunggal (singular), jadi pakai kata kerja tunggal." },
    { q: "The news about the flood ___ very sad this morning.", opts: ["was","were","been"], a: 0, ex: "'News' is uncountable and always takes a singular verb.", exId: "'News' bersifat uncountable dan selalu memakai kata kerja tunggal." },
    { q: "My brother and his friend ___ football every weekend.", opts: ["plays","play","playing"], a: 1, ex: "Two subjects joined by 'and' become plural.", exId: "Dua subjek yang digabung dengan 'and' menjadi jamak (plural)." },
    { q: "Neither the coach nor the players ___ ready for the match.", opts: ["are","is","was"], a: 0, ex: "With 'nor', the verb agrees with the nearest subject (players).", exId: "Dengan 'nor', kata kerja mengikuti subjek terdekat (players)." },
    { q: "A number of people ___ waiting outside the shop.", opts: ["is","are","was"], a: 1, ex: "'A number of' means 'many', so use a plural verb.", exId: "'A number of' berarti 'banyak', jadi pakai kata kerja jamak." },
    { q: "There ___ many people at the park today.", opts: ["are","is","was"], a: 0, ex: "The verb agrees with 'people' (plural), so use 'there are'.", exId: "Kata kerja mengikuti 'people' (jamak), jadi pakai 'there are'." },
    { q: "Some of the water ___ dirty, so don't drink it.", opts: ["is","are","were"], a: 0, ex: "'Some of' + uncountable noun (water) takes a singular verb.", exId: "'Some of' + kata benda uncountable (water) memakai kata kerja tunggal." },
    { q: "Some of the apples in the bowl ___ bad.", opts: ["is","are","was"], a: 1, ex: "'Some of' + plural noun (apples) takes a plural verb.", exId: "'Some of' + kata benda jamak (apples) memakai kata kerja jamak." },
    { q: "All of the bread ___ gone already.", opts: ["are","is","were"], a: 1, ex: "'All of' + uncountable noun (bread) takes a singular verb.", exId: "'All of' + kata benda uncountable (bread) memakai kata kerja tunggal." },
    { q: "None of the food ___ left after the party.", opts: ["was","were","are"], a: 0, ex: "'None of' + uncountable noun (food) takes a singular verb.", exId: "'None of' + kata benda uncountable (food) memakai kata kerja tunggal." },
    { q: "Few of my friends ___ how to swim.", opts: ["knows","know","knowing"], a: 1, ex: "'Few' means several people, so use a plural verb.", exId: "'Few' berarti beberapa orang, jadi pakai kata kerja jamak." },
    { q: "Several students ___ late to class today.", opts: ["was","is","were"], a: 2, ex: "'Several' is plural, so use a plural verb.", exId: "'Several' bersifat jamak, jadi pakai kata kerja jamak." },
    { q: "Many people ___ coffee in the morning.", opts: ["drinks","drink","drinking"], a: 1, ex: "'Many' is plural, so use a plural verb.", exId: "'Many' bersifat jamak, jadi pakai kata kerja jamak." },
    { q: "The results of the test ___ good this year.", opts: ["were","was","is"], a: 0, ex: "The subject is 'results' (plural), not 'test'.", exId: "Subjeknya 'results' (jamak), bukan 'test'." },
    { q: "My mother and father ___ at work right now.", opts: ["are","is","was"], a: 0, ex: "Two subjects joined by 'and' become plural.", exId: "Dua subjek yang digabung dengan 'and' menjadi jamak." },
    { q: "Either the cat or the dog ___ the food every evening.", opts: ["eat","eats","eating"], a: 1, ex: "With 'or', the verb agrees with the nearest subject (dog).", exId: "Dengan 'or', kata kerja mengikuti subjek terdekat (dog)." },
    { q: "The teacher, along with her students, ___ on a trip today.", opts: ["is","are","were"], a: 0, ex: "'Along with' does not change the subject; 'teacher' is singular.", exId: "'Along with' tidak mengubah subjek; 'teacher' tetap tunggal." },
    { q: "Everybody ___ happy at the party last night.", opts: ["were","was","are"], a: 1, ex: "'Everybody' is singular; past context needs 'was'.", exId: "'Everybody' tunggal; konteks lampau memakai 'was'." },
    { q: "Harry Potter ___ a popular book among children.", opts: ["is","are","were"], a: 0, ex: "A book title takes a singular verb.", exId: "Judul buku memakai kata kerja tunggal." },
    { q: "Water ___ at one hundred degrees.", opts: ["boil","boils","boiling"], a: 1, ex: "'Water' is uncountable, so use a singular verb.", exId: "'Water' bersifat uncountable, jadi pakai kata kerja tunggal." },
    { q: "The scissors ___ on the desk near the lamp.", opts: ["are","is","was"], a: 0, ex: "'Scissors' is always plural, so use a plural verb.", exId: "'Scissors' selalu jamak, jadi pakai kata kerja jamak." },
    { q: "The children ___ playing in the garden now.", opts: ["is","was","are"], a: 2, ex: "'Children' is plural, so use a plural verb.", exId: "'Children' bersifat jamak, jadi pakai kata kerja jamak." },
    { q: "My homework ___ very difficult today.", opts: ["is","are","were"], a: 0, ex: "'Homework' is uncountable, so use a singular verb.", exId: "'Homework' bersifat uncountable, jadi pakai kata kerja tunggal." },
    { q: "Each boy and girl ___ a small prize at the end.", opts: ["get","gets","getting"], a: 1, ex: "'Each ... and ...' takes a singular verb.", exId: "'Each ... and ...' memakai kata kerja tunggal." },
    { q: "Neither of my parents ___ tea in the morning.", opts: ["like","liking","likes"], a: 2, ex: "'Neither of' takes a singular verb.", exId: "'Neither of' memakai kata kerja tunggal." },
    { q: "There ___ a lot of noise in the street last night.", opts: ["was","were","are"], a: 0, ex: "'Noise' is uncountable and past, so use 'there was'.", exId: "'Noise' uncountable dan lampau, jadi pakai 'there was'." },
    { q: "Physics and chemistry ___ hard subjects for me.", opts: ["is","are","was"], a: 1, ex: "Two subjects joined by 'and' become plural.", exId: "Dua subjek yang digabung dengan 'and' menjadi jamak." },
    { q: "My new glasses ___ broken again.", opts: ["is","are","was"], a: 1, ex: "'Glasses' is always plural, so use a plural verb.", exId: "'Glasses' selalu jamak, jadi pakai kata kerja jamak." },
    { q: "Which sentence is correct?", opts: ["The news is bad today.","The news are bad today.","The news were bad today."], a: 0, ex: "'News' is uncountable and singular, so use 'is'.", exId: "'News' uncountable dan tunggal, jadi pakai 'is'." },
    { q: "Which one is correct?", opts: ["Each of the boys have a bike.","Each of the boys having a bike.","Each of the boys has a bike."], a: 2, ex: "'Each of' takes a singular verb ('has').", exId: "'Each of' memakai kata kerja tunggal ('has')." },
    { q: "Pick the correct sentence.", opts: ["My father and mother works in a hospital.","My father and mother working in a hospital.","My father and mother work in a hospital."], a: 2, ex: "Two subjects joined by 'and' need a plural verb.", exId: "Dua subjek dengan 'and' butuh kata kerja jamak." },
    { q: "Which sentence uses the verb correctly?", opts: ["Fifty pounds is enough for the trip.","Fifty pounds are enough for the trip.","Fifty pounds be enough for the trip."], a: 0, ex: "A sum of money takes a singular verb.", exId: "Jumlah uang memakai kata kerja tunggal." },
    { q: "Most of the milk ___ gone bad.", opts: ["has","have","having"], a: 0, ex: "'Most of' + uncountable noun (milk) takes a singular verb.", exId: "'Most of' + kata benda uncountable (milk) memakai kata kerja tunggal." },
    { q: "My uncle or my cousins ___ going to help us move.", opts: ["is","are","was"], a: 1, ex: "With 'or', the verb agrees with the nearest subject (cousins).", exId: "Dengan 'or', kata kerja mengikuti subjek terdekat (cousins)." },
    { q: "One of the windows ___ open.", opts: ["is","are","were"], a: 0, ex: "'One of' points to one thing, so use a singular verb.", exId: "'One of' menunjuk satu benda, jadi pakai kata kerja tunggal." },
  ],
  6: [
    { q: "Last Monday she ___ the train at eight and ___ at work by nine.", opts: ["catches, arrives","had caught, had arrived","caught, arrived"], a: 2, ex: "Past simple for completed actions at a stated past time.", exId: "Past simple untuk aksi selesai pada waktu lampau yang disebut." },
    { q: "We ___ the new phones online and ___ for them with a credit card yesterday.", opts: ["ordered, paid","were ordering, were paying","had ordered, had paid"], a: 0, ex: "Past simple lists finished actions that happened yesterday.", exId: "Past simple untuk rangkaian aksi selesai yang terjadi kemarin." },
    { q: "The meeting ___ at ten and finished at eleven this morning.", opts: ["was starting","started","had started"], a: 1, ex: "Past simple for an event completed at a clear past time.", exId: "Past simple untuk kejadian selesai pada waktu lampau yang jelas." },
    { q: "I ___ my boss about the problem during lunch and he agreed to help.", opts: ["was telling","had told","told"], a: 2, ex: "Past simple for a single completed past action.", exId: "Past simple untuk satu aksi lampau yang selesai." },
    { q: "She ___ a new laptop last week because her old one broke.", opts: ["bought","was buying","had been buying"], a: 0, ex: "Past simple for a completed action last week.", exId: "Past simple untuk aksi yang selesai minggu lalu." },
    { q: "First he ___ the email, then he printed the report.", opts: ["was reading","read","had read"], a: 1, ex: "Past simple shows the order of two finished actions.", exId: "Past simple menunjukkan urutan dua aksi yang selesai." },
    { q: "Our flight ___ two hours late, so we missed the connection.", opts: ["was leaving","had left","left"], a: 2, ex: "Past simple for a completed past event with a result.", exId: "Past simple untuk kejadian lampau selesai beserta akibatnya." },
    { q: "They ___ to Bali last summer and stayed for a week.", opts: ["traveled","were traveling","had traveled"], a: 0, ex: "Past simple for a finished trip at a stated time.", exId: "Past simple untuk perjalanan selesai pada waktu lampau tertentu." },
    { q: "The waiter ___ us the menu as soon as we sat down.", opts: ["was bringing","brought","had brought"], a: 1, ex: "Past simple for a quick completed action in the past.", exId: "Past simple untuk aksi cepat yang selesai di masa lampau." },
    { q: "She ___ me a message this morning and I replied at once.", opts: ["was sending","had sent","sent"], a: 2, ex: "Past simple for a completed action at a stated time.", exId: "Past simple untuk aksi selesai pada waktu yang disebut." },
    { q: "While I ___ dinner, the phone rang.", opts: ["was cooking","cooked","had cooked"], a: 0, ex: "Past continuous is the background action interrupted by past simple.", exId: "Past continuous adalah aksi latar yang diganggu oleh past simple." },
    { q: "At eight o'clock last night, we ___ our favorite show when the power suddenly went off.", opts: ["watched","were watching","had watched"], a: 1, ex: "Past continuous for an action in progress when interrupted.", exId: "Past continuous untuk aksi yang sedang berlangsung saat terganggu." },
    { q: "She ___ to the office when she suddenly dropped her coffee.", opts: ["walked","had walked","was walking"], a: 2, ex: "Past continuous for the longer action interrupted by a short one.", exId: "Past continuous untuk aksi panjang yang diganggu aksi pendek." },
    { q: "The students ___ a test when the fire alarm went off.", opts: ["were taking","took","had taken"], a: 0, ex: "Past continuous for an action in progress when another happened.", exId: "Past continuous untuk aksi berlangsung saat kejadian lain muncul." },
    { q: "When the bus finally arrived, I ___ on my phone and almost missed it.", opts: ["texted","was texting","had texted"], a: 1, ex: "Past continuous for an action in progress at a past moment.", exId: "Past continuous untuk aksi yang sedang berlangsung pada saat lampau." },
    { q: "I didn't hear the doorbell because I ___ to music at that moment.", opts: ["listened","had listened","was listening"], a: 2, ex: "Past continuous for an action in progress at that moment.", exId: "Past continuous untuk aksi yang berlangsung pada saat itu." },
    { q: "When I called at nine, my sister ___ her homework, so she couldn't talk.", opts: ["was doing","did","had done"], a: 0, ex: "Past continuous shows she was busy in the middle of it.", exId: "Past continuous menunjukkan ia sedang sibuk di tengah aksi itu." },
    { q: "When I took this photo, the sun ___ behind the mountains.", opts: ["set","was setting","had set"], a: 1, ex: "Past continuous for an action in progress at a past moment.", exId: "Past continuous untuk aksi yang sedang berlangsung pada saat lampau." },
    { q: "By the time we got to the station, the train ___.", opts: ["left","was leaving","had already left"], a: 2, ex: "Past perfect for the earlier of two past events.", exId: "Past perfect untuk kejadian yang lebih dulu dari dua peristiwa lampau." },
    { q: "By the time the guests arrived, my mother ___ all the food.", opts: ["had cooked","cooked","was cooking"], a: 0, ex: "Past perfect for an action finished before another past action.", exId: "Past perfect untuk aksi yang selesai sebelum aksi lampau lain." },
    { q: "When we got to the cinema, the film ___, so we missed the beginning.", opts: ["already started","had already started","was starting"], a: 1, ex: "Past perfect for an action completed before we arrived.", exId: "Past perfect untuk aksi yang selesai sebelum kita tiba." },
    { q: "It was the first time I ___ abroad, so I felt nervous at the airport.", opts: ["traveled","was traveling","had ever traveled"], a: 2, ex: "Past perfect after 'the first time' for earlier experience.", exId: "Past perfect setelah 'the first time' untuk pengalaman sebelumnya." },
    { q: "Before that day, she ___ a smartphone.", opts: ["had never used","never used","was never using"], a: 0, ex: "Past perfect with 'never before' for experience up to then.", exId: "Past perfect dengan 'never before' untuk pengalaman sampai saat itu." },
    { q: "By the time the exam started, I ___ every chapter twice.", opts: ["read","had read","was reading"], a: 1, ex: "Past perfect for an action completed before a later past point.", exId: "Past perfect untuk aksi selesai sebelum titik lampau berikutnya." },
    { q: "By then, the shop ___ its prices twice.", opts: ["raised","was raising","had raised"], a: 2, ex: "Past perfect for actions finished before that past point.", exId: "Past perfect untuk aksi yang selesai sebelum titik lampau itu." },
    { q: "It was the second time she ___ the driving test.", opts: ["had failed","failed","was failing"], a: 0, ex: "Past perfect counts repeated experience before a past moment.", exId: "Past perfect menghitung pengalaman berulang sebelum saat lampau." },
    { q: "By the time we finished dinner, the rain ___.", opts: ["stopped","had stopped","was stopping"], a: 1, ex: "Past perfect for the earlier event before dinner ended.", exId: "Past perfect untuk kejadian lebih awal sebelum makan malam selesai." },
    { q: "When she checked her phone after the meeting, she saw her friend ___ her three times.", opts: ["called","was calling","had called"], a: 2, ex: "Past perfect for calls made before she checked the phone.", exId: "Past perfect untuk panggilan sebelum ia memeriksa telepon." },
    { q: "By the time the teacher collected the books, nobody ___ the homework.", opts: ["had done","did","was doing"], a: 0, ex: "Past perfect for what was not done before that past moment.", exId: "Past perfect untuk yang belum dilakukan sebelum saat lampau itu." },
    { q: "By the time help arrived, the driver ___ out of the car.", opts: ["climbed","had climbed","was climbing"], a: 1, ex: "Past perfect for an action completed before help arrived.", exId: "Past perfect untuk aksi yang selesai sebelum bantuan datang." },
    { q: "She ___ for two hours when the manager finally called her in.", opts: ["waited","was waiting","had been waiting"], a: 2, ex: "Past perfect continuous for duration up to a past point.", exId: "Past perfect continuous untuk durasi sampai suatu titik lampau." },
    { q: "They ___ football for an hour when it started to rain.", opts: ["had been playing","played","were playing"], a: 0, ex: "Past perfect continuous for an ongoing action before it rained.", exId: "Past perfect continuous untuk aksi berjalan sebelum hujan turun." },
    { q: "I ___ at that company for five years when it suddenly closed.", opts: ["worked","had been working","was working"], a: 1, ex: "Past perfect continuous for duration up to a sudden past event.", exId: "Past perfect continuous untuk durasi hingga kejadian lampau mendadak." },
    { q: "I ___ at the screen for hours when I finally took a break.", opts: ["looked","was looking","had been looking"], a: 2, ex: "Past perfect continuous for duration up to a past break.", exId: "Past perfect continuous untuk durasi hingga jeda di masa lampau." },
    { q: "By 2020, she ___ English for ten years.", opts: ["had been teaching","taught","was teaching"], a: 0, ex: "Past perfect continuous for duration up to a past point.", exId: "Past perfect continuous untuk durasi sampai suatu titik lampau." },
    { q: "He ___ the guitar for three years when he decided to join a band.", opts: ["played","had been playing","was playing"], a: 1, ex: "Past perfect continuous for duration up to a past decision.", exId: "Past perfect continuous untuk durasi hingga keputusan di masa lampau." },
    { q: "It ___ for hours when we finally saw the sun.", opts: ["rained","was raining","had been raining"], a: 2, ex: "Past perfect continuous for duration up to a past moment.", exId: "Past perfect continuous untuk durasi sampai suatu saat lampau." },
    { q: "She ___ money for months when she suddenly lost her job.", opts: ["had been saving","saved","was saving"], a: 0, ex: "Past perfect continuous for duration up to a sudden past event.", exId: "Past perfect continuous untuk durasi hingga kejadian lampau mendadak." },
    { q: "By the time the results came out, the students ___ for weeks.", opts: ["studied","had been studying","were studying"], a: 1, ex: "Past perfect continuous for duration up to a past point.", exId: "Past perfect continuous untuk durasi sampai suatu titik lampau." },
    { q: "There ___ be a bookshop on this street, but it closed years ago.", opts: ["would","is used to","used to"], a: 2, ex: "Use 'used to', not 'would', for past states.", exId: "Pakai 'used to', bukan 'would', untuk keadaan (state) lampau." },
    { q: "I ___ have long hair when I was a teenager.", opts: ["used to","would","was"], a: 0, ex: "Only 'used to' works for a past state like having hair.", exId: "Hanya 'used to' untuk state lampau seperti memiliki rambut." },
    { q: "My father ___ own a small shop before he retired.", opts: ["would","used to","is used to"], a: 1, ex: "Use 'used to' for the past state of owning something.", exId: "Pakai 'used to' untuk state lampau seperti memiliki sesuatu." },
    { q: "This building ___ be a hospital, but now it's a hotel.", opts: ["would","was used to","used to"], a: 2, ex: "Use 'used to' for a past state, not 'would'.", exId: "Pakai 'used to' untuk state lampau, bukan 'would'." },
    { q: "I didn't ___ enjoy studying, but now I find it interesting.", opts: ["use to","used to","using to"], a: 0, ex: "After 'didn't', use base form 'use to'.", exId: "Setelah 'didn't', pakai bentuk dasar 'use to'." },
    { q: "___ you use to take the bus to work?", opts: ["Were","Did","Had"], a: 1, ex: "Questions use 'Did ... use to ...?'", exId: "Bentuk pertanyaan memakai 'Did ... use to ...?'" },
    { q: "When I lived in Japan, I ___ eat rice every day.", opts: ["was used to","am used to","used to"], a: 2, ex: "'Used to' + base verb for a past habit.", exId: "'Used to' + kata kerja dasar untuk kebiasaan lampau." },
    { q: "After a month, she ___ working night shifts and no longer felt tired.", opts: ["was used to","used to","would"], a: 0, ex: "'Be used to' + -ing means accustomed to something.", exId: "'Be used to' + -ing berarti terbiasa dengan sesuatu." },
    { q: "When we were children, every Saturday my grandfather ___ us to the market.", opts: ["was taking","would take","had taken"], a: 1, ex: "'Would' for repeated past habits (actions, not states).", exId: "'Would' untuk kebiasaan lampau berulang (aksi, bukan state)." },
    { q: "My brother ___ be very shy, but now he's confident and outgoing.", opts: ["would","was used to","used to"], a: 2, ex: "Use 'used to' for a past state like being shy.", exId: "Pakai 'used to' untuk state lampau seperti menjadi pemalu." },
    { q: "Which sentence is correct?", opts: ["By the time we arrived, the concert had already started.","By the time we arrived, the concert has already started.","By the time we arrived, the concert already started."], a: 0, ex: "Past perfect ('had') for the earlier past event.", exId: "Past perfect ('had') untuk kejadian lampau yang lebih awal." },
    { q: "Which sentence is correct?", opts: ["I read a book when the lights were going out.","I was reading a book when the lights went out.","I had read a book when the lights went out."], a: 1, ex: "Past continuous is interrupted by past simple.", exId: "Past continuous diganggu oleh past simple." },
    { q: "Which sentence is correct?", opts: ["She use to have a red car.","She was used to have a red car.","She used to have a red car."], a: 2, ex: "'Used to' + base verb for past states and habits.", exId: "'Used to' + kata kerja dasar untuk state dan kebiasaan lampau." },
    { q: "Which sentence is correct?", opts: ["We had been driving for three hours when the car broke down.","We had driven for three hours when the car was breaking down.","We were driving for three hours when the car broke down."], a: 0, ex: "Past perfect continuous for duration before a sudden past event.", exId: "Past perfect continuous untuk durasi sebelum kejadian lampau mendadak." },
    { q: "Which sentence is correct?", opts: ["Before he left, he has finished all his work.","Before he left, he had finished all his work.","Before he left, he was finishing all his work."], a: 1, ex: "Past perfect ('had') for the action finished before he left.", exId: "Past perfect ('had') untuk aksi yang selesai sebelum ia pergi." },
    { q: "Which sentence is correct?", opts: ["When I was young, I would be afraid of dogs.","When I was young, I was used to be afraid of dogs.","When I was young, I used to be afraid of dogs."], a: 2, ex: "Use 'used to' for a past state like being afraid.", exId: "Pakai 'used to' untuk state lampau seperti merasa takut." },
    { q: "Last Saturday we ___ to the market and bought some fresh fish.", opts: ["was walking","walked","had walked"], a: 1, ex: "Past simple for completed actions in a sequence at a stated past time.", exId: "Past simple untuk aksi selesai yang berurutan pada waktu lampau yang jelas." },
    { q: "She ___ the door, put on her coat, and left the house.", opts: ["opened","was opening","had opened"], a: 0, ex: "Past simple for a chain of finished actions, one after another.", exId: "Past simple untuk rangkaian aksi yang selesai, satu demi satu." },
    { q: "In 2019 my brother ___ a new job in another city.", opts: ["had got","got","was getting"], a: 1, ex: "Past simple for a completed action at a stated past year.", exId: "Past simple untuk aksi selesai pada tahun lampau yang disebutkan." },
    { q: "Yesterday morning I ___ up early and made breakfast for everyone.", opts: ["was waking","had woken","woke"], a: 2, ex: "Past simple for finished actions at a stated past time.", exId: "Past simple untuk aksi selesai pada waktu lampau yang disebutkan." },
    { q: "We ___ a lot of photos during our visit to the castle last week.", opts: ["took","were taking","had taken"], a: 0, ex: "Past simple for a completed action finished last week.", exId: "Past simple untuk aksi yang selesai minggu lalu." },
    { q: "He ___ home late, ate dinner, and went straight to bed.", opts: ["had come","came","was coming"], a: 1, ex: "Past simple for a sequence of finished actions in order.", exId: "Past simple untuk urutan aksi selesai secara berurutan." },
    { q: "Last night our team ___ the match two goals to one.", opts: ["won","was winning","had won"], a: 0, ex: "Past simple for a completed result at a stated past time.", exId: "Past simple untuk hasil selesai pada waktu lampau yang jelas." },
    { q: "When you called me at eight, I ___ a shower.", opts: ["was taking","took","had taken"], a: 0, ex: "Past continuous for an action in progress when another action happened.", exId: "Past continuous untuk aksi yang sedang berlangsung saat aksi lain terjadi." },
    { q: "I ___ down the street when I saw an old friend.", opts: ["had walked","was walking","walked"], a: 1, ex: "Past continuous for the ongoing action interrupted by a past simple event.", exId: "Past continuous untuk aksi berlangsung yang disela kejadian past simple." },
    { q: "They ___ football in the park when it started to rain.", opts: ["played","were playing","had played"], a: 1, ex: "Past continuous for the longer action interrupted by a sudden event.", exId: "Past continuous untuk aksi lebih panjang yang disela kejadian tiba-tiba." },
    { q: "This time yesterday, we ___ on the beach in the sun.", opts: ["were sitting","sat","had sat"], a: 0, ex: "Past continuous for an action in progress at a past moment.", exId: "Past continuous untuk aksi yang sedang berlangsung pada momen lampau." },
    { q: "She ___ dinner when her guests arrived early, so it wasn't ready yet.", opts: ["cooked","was cooking","had cooked"], a: 1, ex: "Past continuous for the unfinished action in progress when guests arrived.", exId: "Past continuous untuk aksi belum selesai yang berlangsung saat tamu datang." },
    { q: "While we ___ in the garden, it began to rain.", opts: ["were relaxing","relaxed","had relaxed"], a: 0, ex: "Past continuous for the ongoing background action interrupted by a past simple.", exId: "Past continuous untuk aksi latar berlangsung yang disela past simple." },
    { q: "When the accident happened, I ___ across the road.", opts: ["walked","was walking","had walked"], a: 1, ex: "Past continuous for the action in progress when a sudden event happened.", exId: "Past continuous untuk aksi berlangsung saat kejadian tiba-tiba terjadi." },
    { q: "By the time the guests arrived, we ___ the whole house.", opts: ["cleaned","were cleaning","had cleaned"], a: 2, ex: "Past perfect for the action finished before the guests arrived.", exId: "Past perfect untuk aksi yang selesai sebelum tamu datang." },
    { q: "By the time I got home, my sister ___ all the cake.", opts: ["ate","was eating","had eaten"], a: 2, ex: "Past perfect for the earlier completed action before getting home.", exId: "Past perfect untuk aksi lebih awal yang selesai sebelum sampai rumah." },
    { q: "The film had already started by the time we ___ our seats.", opts: ["found","were finding","had found"], a: 0, ex: "Past simple for the later event; the earlier one is already past perfect.", exId: "Past simple untuk kejadian belakangan; yang lebih awal sudah past perfect." },
    { q: "When we got to the airport, our plane ___ and the gate was closed.", opts: ["already left","had already left","was already leaving"], a: 1, ex: "Past perfect for the earlier completed action before we arrived.", exId: "Past perfect untuk aksi lebih awal yang selesai sebelum kami tiba." },
    { q: "That was the best book I ___ ever read.", opts: ["read","have ever read","had ever read"], a: 2, ex: "Past perfect after a superlative in a past-time sentence.", exId: "Past perfect setelah bentuk superlatif dalam kalimat waktu lampau." },
    { q: "By the time the film ended, half the audience ___ asleep.", opts: ["fell","were falling","had fallen"], a: 2, ex: "Past perfect for the action completed before the film ended.", exId: "Past perfect untuk aksi yang selesai sebelum film berakhir." },
    { q: "When the police arrived, the thief ___ and the house was empty.", opts: ["escaped","had escaped","was escaping"], a: 1, ex: "Past perfect for the earlier action finished before the police came.", exId: "Past perfect untuk aksi lebih awal yang selesai sebelum polisi datang." },
    { q: "By the time the bus came, we ___ for twenty minutes.", opts: ["had been waiting","waited","were waiting"], a: 0, ex: "Past perfect continuous for a duration continuing up to a past point.", exId: "Past perfect continuous untuk durasi yang berlanjut sampai titik lampau." },
    { q: "When the teacher walked in, the students ___ for ten minutes.", opts: ["talked","had been talking","were talking"], a: 1, ex: "Past perfect continuous for a duration lasting up to a past moment.", exId: "Past perfect continuous untuk durasi yang berlangsung sampai momen lampau." },
    { q: "Her hands were covered in flour because she ___ bread all afternoon.", opts: ["baked","was baking","had been baking"], a: 2, ex: "Past perfect continuous for a long activity explaining a past result.", exId: "Past perfect continuous untuk aktivitas panjang yang menjelaskan hasil lampau." },
    { q: "My eyes hurt because I ___ at the computer for hours.", opts: ["had been looking","looked","was looking"], a: 0, ex: "Past perfect continuous for a duration causing a past result.", exId: "Past perfect continuous untuk durasi yang menyebabkan hasil lampau." },
    { q: "His legs were sore because he ___ all morning.", opts: ["ran","was running","had been running"], a: 2, ex: "Past perfect continuous for an activity lasting up to a past point.", exId: "Past perfect continuous untuk aktivitas yang berlangsung sampai titik lampau." },
    { q: "When she finally answered the phone, it ___ for a full minute.", opts: ["rang","had been ringing","was ringing"], a: 1, ex: "Past perfect continuous for a duration continuing until a past action.", exId: "Past perfect continuous untuk durasi yang berlanjut sampai aksi lampau." },
    { q: "The players were exhausted because they ___ for two hours.", opts: ["had been playing","played","were playing"], a: 0, ex: "Past perfect continuous for a long activity explaining a past state.", exId: "Past perfect continuous untuk aktivitas panjang yang menjelaskan keadaan lampau." },
    { q: "How long ___ you ___ before the taxi finally arrived?", opts: ["did, wait","were, waiting","had, been waiting"], a: 2, ex: "Past perfect continuous asks about duration up to a past point.", exId: "Past perfect continuous menanyakan durasi sampai suatu titik lampau." },
    { q: "When I was young, I ___ walk to school every day.", opts: ["use to","used to","am used to"], a: 1, ex: "'Used to' for a past habit that no longer happens.", exId: "'Used to' untuk kebiasaan lampau yang sudah tidak terjadi lagi." },
    { q: "I ___ like vegetables when I was a child, but now I love them.", opts: ["used to","would","was using"], a: 0, ex: "Only 'used to' for a past state; 'like' is not an action.", exId: "Hanya 'used to' untuk keadaan lampau; 'like' bukan aksi." },
    { q: "Did you ___ live near the sea when you were little?", opts: ["used to","use to","using to"], a: 1, ex: "After 'did', use the base form 'use to'.", exId: "Setelah 'did', pakai bentuk dasar 'use to'." },
    { q: "My grandmother ___ tell us wonderful stories every evening.", opts: ["was used to","used to","use to"], a: 1, ex: "'Used to' for a repeated past habit that is now finished.", exId: "'Used to' untuk kebiasaan lampau yang berulang dan kini berakhir." },
  ],
  7: [
    { q: "I ___ what you mean, but I still disagree with the plan.", opts: ["am understanding","understand","have understood"], a: 1, ex: "'Understand' is a state verb; use present simple, not continuous.", exId: "'Understand' adalah state verb; pakai present simple, bukan continuous." },
    { q: "My manager ___ three languages fluently.", opts: ["knows","is knowing","has been knowing"], a: 0, ex: "'Know' is a state verb; use present simple 'knows'.", exId: "'Know' adalah state verb; pakai present simple 'knows'." },
    { q: "This new laptop ___ to the company, not to me.", opts: ["is belonging","belongs","has belonged"], a: 1, ex: "'Belong' is a state verb; use present simple, not continuous.", exId: "'Belong' adalah state verb; pakai present simple, bukan continuous." },
    { q: "I ___ a new phone because my old one is broken.", opts: ["need","am needing","have needed"], a: 0, ex: "'Need' is a state verb; use present simple, not continuous.", exId: "'Need' adalah state verb; pakai present simple, bukan continuous." },
    { q: "My uncle ___ a small shop in the city center.", opts: ["owns","is owning","has been owning"], a: 0, ex: "'Own' is a state verb; use present simple for possession.", exId: "'Own' state verb; pakai present simple untuk kepemilikan." },
    { q: "We ___ to travel around Europe next summer.", opts: ["want","are wanting","have wanted"], a: 0, ex: "'Want' is a state verb; use present simple, not continuous.", exId: "'Want' state verb; pakai present simple, bukan continuous." },
    { q: "My little sister ___ chocolate more than any other sweet.", opts: ["is liking","likes","has liked"], a: 1, ex: "'Like' is a state verb; use present simple for preferences.", exId: "'Like' state verb; pakai present simple untuk kesukaan." },
    { q: "According to the timetable, the train to London ___ at 9 a.m.", opts: ["is leaving","leaves","has left"], a: 1, ex: "Timetables use present simple for scheduled events.", exId: "Jadwal (timetable) pakai present simple untuk acara terjadwal." },
    { q: "In science class we learn that water ___ at 100 degrees Celsius.", opts: ["is boiling","boils","has boiled"], a: 1, ex: "General facts use present simple.", exId: "Fakta umum pakai present simple." },
    { q: "I usually ___ to work by bus, but today I walked.", opts: ["go","am going","have gone"], a: 0, ex: "'Usually' shows a routine; use present simple.", exId: "'Usually' menandakan rutinitas; pakai present simple." },
    { q: "The supermarket ___ at eight o'clock every morning.", opts: ["opens","is opening","has opened"], a: 0, ex: "'Every morning' shows a routine; use present simple.", exId: "'Every morning' menandakan rutinitas; pakai present simple." },
    { q: "My father ___ a cup of coffee before work every day.", opts: ["is drinking","drinks","has drunk"], a: 1, ex: "'Every day' shows a habit; use present simple.", exId: "'Every day' menandakan kebiasaan; pakai present simple." },
    { q: "Everyone knows that the Earth ___ around the Sun.", opts: ["goes","is going","has gone"], a: 0, ex: "General facts use present simple.", exId: "Fakta umum pakai present simple." },
    { q: "Please be quiet. The baby ___ in the next room.", opts: ["sleeps","is sleeping","has slept"], a: 1, ex: "An action happening now uses present continuous.", exId: "Aksi yang sedang terjadi sekarang pakai present continuous." },
    { q: "Take a jacket. The wind ___ very hard right now.", opts: ["blows","is blowing","has blown"], a: 1, ex: "'Right now' means present continuous.", exId: "'Right now' berarti present continuous." },
    { q: "I can't talk at the moment; I ___ dinner for my family.", opts: ["cook","am cooking","have cooked"], a: 1, ex: "'At the moment' means present continuous.", exId: "'At the moment' berarti present continuous." },
    { q: "She ___ with her parents this month while her flat is repaired.", opts: ["is staying","stays","has stayed"], a: 0, ex: "A temporary situation now uses present continuous.", exId: "Situasi sementara sekarang pakai present continuous." },
    { q: "Don't disturb them. The students ___ for their final exam now.", opts: ["study","are studying","have studied"], a: 1, ex: "'Now' means an action in progress: present continuous.", exId: "'Now' berarti aksi sedang berlangsung: present continuous." },
    { q: "Please call back later. My boss ___ a meeting at the moment.", opts: ["has","is having","has had"], a: 1, ex: "'At the moment' means present continuous; 'have a meeting' is dynamic.", exId: "'At the moment' berarti present continuous; 'have a meeting' dinamis." },
    { q: "These days my brother ___ very hard to pass his driving test.", opts: ["works","is working","has worked"], a: 1, ex: "'These days' shows a temporary situation: present continuous.", exId: "'These days' menandakan situasi sementara: present continuous." },
    { q: "More and more people ___ online instead of going to shops.", opts: ["are shopping","shop","have shopped"], a: 0, ex: "Changing trends use present continuous, especially with 'more and more'.", exId: "Tren yang berubah pakai present continuous, apalagi dengan 'more and more'." },
    { q: "House prices in this area ___ faster than before.", opts: ["rise","are rising","have risen"], a: 1, ex: "'Faster than before' shows a trend: present continuous.", exId: "'Faster than before' menandakan tren: present continuous." },
    { q: "I ___ three cups of coffee today, and it's only noon.", opts: ["drink","drank","have drunk"], a: 2, ex: "'Today' is unfinished time; use present perfect.", exId: "'Today' waktu belum selesai; pakai present perfect." },
    { q: "Our team ___ a lot of work this week.", opts: ["does","did","has done"], a: 2, ex: "'This week' is unfinished time; use present perfect.", exId: "'This week' waktu belum selesai; pakai present perfect." },
    { q: "So far this month, she ___ very hard at the office.", opts: ["works","worked","has worked"], a: 2, ex: "'So far this month' is unfinished time; use present perfect.", exId: "'So far this month' waktu belum selesai; pakai present perfect." },
    { q: "Have you ever ___ sushi at a Japanese restaurant?", opts: ["eaten","ate","eat"], a: 0, ex: "'Ever' asks about experience; use present perfect (have + V3).", exId: "'Ever' menanyakan pengalaman; pakai present perfect (have + V3)." },
    { q: "I have never ___ abroad in my whole life.", opts: ["travel","traveled","been travelling"], a: 1, ex: "'Never' shows life experience; use present perfect (have + V3).", exId: "'Never' pengalaman hidup; pakai present perfect (have + V3)." },
    { q: "She ___ this book before, so she already knows the ending.", opts: ["reads","read","has read"], a: 2, ex: "'Before' shows experience; use present perfect.", exId: "'Before' menandakan pengalaman; pakai present perfect." },
    { q: "I've already ___ my report, so now I can relax.", opts: ["finish","finished","been finishing"], a: 1, ex: "After 'already', use the past participle: present perfect.", exId: "Setelah 'already', pakai past participle: present perfect." },
    { q: "Hurry up! The film ___ already started.", opts: ["has","is","have"], a: 0, ex: "'Already' with 'started' needs present perfect: 'has started'.", exId: "'Already' dengan 'started' butuh present perfect: 'has started'." },
    { q: "I can't find my keys. I ___ them yet.", opts: ["don't find","didn't find","haven't found"], a: 2, ex: "'Yet' in a negative sentence uses present perfect.", exId: "'Yet' dalam kalimat negatif pakai present perfect." },
    { q: "___ you finished your homework yet?", opts: ["Did","Have","Do"], a: 1, ex: "Questions with 'yet' use present perfect: 'Have you...?'", exId: "Pertanyaan dengan 'yet' pakai present perfect: 'Have you...?'" },
    { q: "You just missed them; they ___ just left the office.", opts: ["are","have","did"], a: 1, ex: "'Just' for a very recent action uses present perfect.", exId: "'Just' untuk aksi baru saja pakai present perfect." },
    { q: "We ___ in this city since 2015.", opts: ["live","lived","have lived"], a: 2, ex: "'Since' with a state verb uses present perfect.", exId: "'Since' dengan state verb pakai present perfect." },
    { q: "I ___ this laptop for about three years now.", opts: ["have","have had","have been having"], a: 1, ex: "'Have' is a state verb; use present perfect, not continuous.", exId: "'Have' state verb; pakai present perfect, bukan continuous." },
    { q: "She ___ me since we were children.", opts: ["knows","has known","has been knowing"], a: 1, ex: "'Know' is a state verb; use present perfect, not continuous.", exId: "'Know' state verb; pakai present perfect, bukan continuous." },
    { q: "My eyes hurt because I ___ at the screen for hours.", opts: ["look","have looked","have been looking"], a: 2, ex: "Duration of an action with a result now: present perfect continuous.", exId: "Durasi aksi dengan hasil sekarang: present perfect continuous." },
    { q: "She ___ Spanish for two years, and she is getting better.", opts: ["learns","is learning","has been learning"], a: 2, ex: "'For two years' with an action verb: present perfect continuous.", exId: "'For two years' dengan action verb: present perfect continuous." },
    { q: "He is out of breath because he ___ since this morning.", opts: ["runs","has run","has been running"], a: 2, ex: "'Since this morning' plus a result now: present perfect continuous.", exId: "'Since this morning' plus hasil sekarang: present perfect continuous." },
    { q: "They ___ for the bus for twenty minutes, and it still hasn't come.", opts: ["wait","waited","have been waiting"], a: 2, ex: "Duration of an ongoing action: present perfect continuous.", exId: "Durasi aksi yang masih berlangsung: present perfect continuous." },
    { q: "I ___ this book since Monday, but I haven't finished it yet.", opts: ["read","am reading","have been reading"], a: 2, ex: "'Since Monday' with an unfinished action: present perfect continuous.", exId: "'Since Monday' dengan aksi belum selesai: present perfect continuous." },
    { q: "It ___ all day, so the streets are very wet.", opts: ["rains","has been raining","is raining"], a: 1, ex: "'All day' with a present result: present perfect continuous.", exId: "'All day' dengan hasil sekarang: present perfect continuous." },
    { q: "I ___ my new phone last week at the mall.", opts: ["bought","buy","have bought"], a: 0, ex: "'Last week' is finished past time; use past simple.", exId: "'Last week' waktu lampau selesai; pakai past simple." },
    { q: "She ___ university in 2019 and started working right away.", opts: ["finishes","finished","has finished"], a: 1, ex: "A finished year (2019) uses past simple.", exId: "Tahun yang sudah lewat (2019) pakai past simple." },
    { q: "We ___ to Bali on holiday two years ago.", opts: ["go","went","have gone"], a: 1, ex: "'Ago' shows finished past time; use past simple.", exId: "'Ago' waktu lampau selesai; pakai past simple." },
    { q: "He ___ an important meeting yesterday afternoon.", opts: ["attends","attended","has attended"], a: 1, ex: "'Yesterday' is finished past time; use past simple.", exId: "'Yesterday' waktu lampau selesai; pakai past simple." },
    { q: "Which sentence is correct?", opts: ["I am knowing the answer to this question.","I know the answer to this question.","I have been knowing the answer to this question."], a: 1, ex: "'Know' is a state verb; use present simple.", exId: "'Know' state verb; pakai present simple." },
    { q: "Which sentence is correct?", opts: ["She has lived here since ten years.","She has lived here for ten years.","She lives here for ten years."], a: 1, ex: "Use 'for' with a period of time in present perfect.", exId: "Pakai 'for' dengan durasi waktu dalam present perfect." },
    { q: "Which sentence is correct?", opts: ["I have seen that film yesterday.","I saw that film yesterday.","I am seeing that film yesterday."], a: 1, ex: "'Yesterday' needs past simple, not present perfect.", exId: "'Yesterday' butuh past simple, bukan present perfect." },
    { q: "Which sentence is correct?", opts: ["My phone rings at the moment.","My phone is ringing at the moment.","My phone has rung at the moment."], a: 1, ex: "'At the moment' means an action now: present continuous.", exId: "'At the moment' berarti aksi sekarang: present continuous." },
    { q: "Which sentence is correct?", opts: ["I have been working here for five years.","I am working here for five years.","I work here for five years."], a: 0, ex: "'For five years' of ongoing work: present perfect continuous.", exId: "'For five years' kerja yang berlangsung: present perfect continuous." },
    { q: "Which sentence is correct?", opts: ["I have already finished my homework.","I have already finish my homework.","I am already finishing my homework yesterday."], a: 0, ex: "After 'already' use the past participle in present perfect.", exId: "Setelah 'already' pakai past participle dalam present perfect." },
    { q: "I ___ the answer to your question.", opts: ["am knowing","know","have known"], a: 1, ex: "'Know' is a state verb; use present simple, not continuous.", exId: "'Know' adalah state verb; pakai present simple, bukan continuous." },
    { q: "My brother ___ to the gym every morning before work.", opts: ["is going","goes","has gone"], a: 1, ex: "Use present simple for daily routines.", exId: "Pakai present simple untuk rutinitas harian." },
    { q: "I ___ a cup of coffee right now.", opts: ["am wanting","have wanted","want"], a: 2, ex: "'Want' is a state verb; no continuous even with 'now'.", exId: "'Want' adalah state verb; tak pakai continuous walau ada 'now'." },
    { q: "She ___ some help with her homework tonight.", opts: ["is needing","needs","has needed"], a: 1, ex: "'Need' is a state verb; use present simple.", exId: "'Need' adalah state verb; pakai present simple." },
    { q: "We ___ spicy food, so we often eat at the Thai restaurant.", opts: ["are liking","like","have liked"], a: 1, ex: "'Like' is a state verb; use present simple.", exId: "'Like' adalah state verb; pakai present simple." },
    { q: "The restaurant ___ at ten o'clock every night.", opts: ["has closed","closes","is closing"], a: 1, ex: "Use present simple for regular routines.", exId: "Pakai present simple untuk rutinitas rutin." },
    { q: "The sun ___ in the east.", opts: ["is rising","rises","has risen"], a: 1, ex: "Use present simple for permanent facts.", exId: "Pakai present simple untuk fakta permanen." },
    { q: "My father usually ___ the dishes after dinner.", opts: ["is washing","washes","has washed"], a: 1, ex: "Adverbs like 'usually' signal a present simple routine.", exId: "Kata seperti 'usually' menandakan rutinitas present simple." },
    { q: "According to the timetable, the film ___ at 7:30 this evening.", opts: ["is starting","starts","has started"], a: 1, ex: "Use present simple for scheduled events.", exId: "Pakai present simple untuk acara terjadwal." },
    { q: "Look! It ___ outside, so take an umbrella.", opts: ["rains","is raining","has rained"], a: 1, ex: "'Look!' signals something happening now: present continuous.", exId: "'Look!' menandakan hal yang sedang terjadi: present continuous." },
    { q: "I usually take the bus, but this week I ___ to work.", opts: ["walk","am walking","have walked"], a: 1, ex: "Use present continuous for temporary situations.", exId: "Pakai present continuous untuk situasi sementara." },
    { q: "Where is Mum? She ___ dinner in the kitchen.", opts: ["cooks","has cooked","is cooking"], a: 2, ex: "Use present continuous for an action in progress now.", exId: "Pakai present continuous untuk aksi yang sedang berlangsung sekarang." },
    { q: "My car is broken, so I ___ my bike to the office this month.", opts: ["ride","am riding","have ridden"], a: 1, ex: "Use present continuous for a temporary arrangement.", exId: "Pakai present continuous untuk keadaan sementara." },
    { q: "Look around — this part of town ___ more modern and lively.", opts: ["gets","is getting","has got"], a: 1, ex: "Use present continuous for a developing, changing situation.", exId: "Pakai present continuous untuk situasi yang sedang berubah." },
    { q: "Listen! Someone ___ the piano upstairs.", opts: ["plays","has played","is playing"], a: 2, ex: "'Listen!' signals an action happening now: present continuous.", exId: "'Listen!' menandakan aksi yang sedang terjadi: present continuous." },
    { q: "I can't talk now; I ___ a very important email.", opts: ["write","have written","am writing"], a: 2, ex: "Use present continuous for what you are doing right now.", exId: "Pakai present continuous untuk yang sedang kamu lakukan sekarang." },
    { q: "He normally works in London, but he ___ in Paris this month.", opts: ["works","is working","has worked"], a: 1, ex: "Use present continuous for a temporary situation.", exId: "Pakai present continuous untuk situasi sementara." },
    { q: "Don't turn off the TV. I ___ that programme.", opts: ["watch","have watched","am watching"], a: 2, ex: "Use present continuous for an action happening now.", exId: "Pakai present continuous untuk aksi yang sedang terjadi sekarang." },
    { q: "I don't want to watch this film again; I ___ it before.", opts: ["saw","have seen","see"], a: 1, ex: "'Before' for experience uses present perfect.", exId: "'Before' untuk pengalaman pakai present perfect." },
    { q: "My cousin ___ to London several times.", opts: ["has been","was","is being"], a: 0, ex: "Use present perfect for experiences without a set time.", exId: "Pakai present perfect untuk pengalaman tanpa waktu tertentu." },
    { q: "I'm not hungry because I ___ lunch.", opts: ["eat","am eating","have just eaten"], a: 2, ex: "'Just' for a very recent action uses present perfect.", exId: "'Just' untuk aksi yang baru saja pakai present perfect." },
    { q: "You don't need to buy milk; I ___ some.", opts: ["already buy","have already bought","am already buying"], a: 1, ex: "'Already' uses present perfect.", exId: "'Already' pakai present perfect." },
    { q: "I ___ my homework yet.", opts: ["haven't finished","don't finish","am not finishing"], a: 0, ex: "'Yet' in a negative sentence uses present perfect.", exId: "'Yet' dalam kalimat negatif pakai present perfect." },
    { q: "We ___ in this neighbourhood for ten years.", opts: ["live","have lived","are living"], a: 1, ex: "'For + period' with a state uses present perfect for unfinished time.", exId: "'For + periode' dengan keadaan pakai present perfect untuk waktu belum selesai." },
    { q: "She ___ for that company since 2015.", opts: ["works","is working","has worked"], a: 2, ex: "'Since + point in time' uses present perfect.", exId: "'Since + titik waktu' pakai present perfect." },
    { q: "I ___ my keys yesterday.", opts: ["lost","have lost","have been losing"], a: 0, ex: "Finished past time 'yesterday' uses past simple.", exId: "Waktu lampau selesai 'yesterday' pakai past simple." },
    { q: "She ___ the piano when she was a child.", opts: ["has played","played","has been playing"], a: 1, ex: "A finished past period uses past simple.", exId: "Periode lampau yang selesai pakai past simple." },
    { q: "I ___ to the gym twice this week.", opts: ["went","have gone","go"], a: 1, ex: "'This week' is unfinished; use present perfect.", exId: "'This week' belum selesai; pakai present perfect." },
    { q: "This is the first time I ___ Indian food.", opts: ["have tried","tried","try"], a: 0, ex: "'This is the first time...' uses present perfect.", exId: "'This is the first time...' pakai present perfect." },
    { q: "The window is broken — someone ___ it with a ball.", opts: ["has broken","breaks","is breaking"], a: 0, ex: "Present perfect shows a past action with a present result.", exId: "Present perfect menunjukkan aksi lampau dengan hasil sekarang." },
    { q: "I ___ for three hours, so I'm really tired now.", opts: ["study","am studying","have been studying"], a: 2, ex: "Use present perfect continuous for the duration of an activity.", exId: "Pakai present perfect continuous untuk durasi suatu aktivitas." },
    { q: "She ___ since eight o'clock this morning.", opts: ["works","has been working","is working"], a: 1, ex: "'Since' + ongoing activity uses present perfect continuous.", exId: "'Since' + aktivitas berlangsung pakai present perfect continuous." },
    { q: "They ___ football for two hours and they're still playing.", opts: ["play","are playing","have been playing"], a: 2, ex: "Use present perfect continuous for an activity still in progress.", exId: "Pakai present perfect continuous untuk aktivitas yang masih berlangsung." },
    { q: "He ___ the guitar since he was ten years old.", opts: ["has been playing","plays","is playing"], a: 0, ex: "'Since' + a long activity uses present perfect continuous.", exId: "'Since' + aktivitas panjang pakai present perfect continuous." },
    { q: "How long ___ Spanish?", opts: ["have you been learning","do you learn","are you learning"], a: 0, ex: "'How long' about an activity uses present perfect continuous.", exId: "'How long' tentang aktivitas pakai present perfect continuous." },
    { q: "It ___ non-stop since yesterday.", opts: ["snows","is snowing","has been snowing"], a: 2, ex: "'Since' + duration uses present perfect continuous.", exId: "'Since' + durasi pakai present perfect continuous." },
  ],
  8: [
    { q: "The phone is ringing. Don't worry, I ___ answer it.", opts: ["will","am going to","answer","am answering"], a: 0, ex: "Use 'will' for a decision made at the moment of speaking.", exId: "Pakai 'will' untuk keputusan spontan yang diambil saat berbicara." },
    { q: "It's cold in here. Is it? I ___ close the window then.", opts: ["close","am closing","will close","am going to close"], a: 2, ex: "'Will' shows an instant decision reacting to a situation.", exId: "'Will' untuk keputusan mendadak sebagai reaksi terhadap situasi." },
    { q: "Those bags look really heavy. I ___ carry one for you.", opts: ["will","am going to","carry","am carrying"], a: 0, ex: "Use 'will' to offer help to someone.", exId: "Pakai 'will' untuk menawarkan bantuan kepada seseorang." },
    { q: "I ___ never tell anyone your secret. I promise.", opts: ["am telling","will","am going to","tell"], a: 1, ex: "'Will' makes a promise, often used with 'I promise'.", exId: "'Will' untuk membuat janji, sering dengan 'I promise'." },
    { q: "You've lent me money again. Thank you, I ___ you back tomorrow, for sure.", opts: ["pay","paying","am paid","will pay"], a: 3, ex: "'Will' for a promise made at the moment of speaking.", exId: "'Will' untuk janji yang diucapkan saat itu juga." },
    { q: "I think prices ___ higher next year, but I'm really not sure.", opts: ["are","will be","are being","will being"], a: 1, ex: "After 'I think', use 'will' for an opinion about the future.", exId: "Setelah 'I think', pakai 'will' untuk prediksi/opini masa depan." },
    { q: "In my opinion, robots ___ a lot of office work in the future.", opts: ["are doing","do","will do","are going to doing"], a: 2, ex: "'Will' expresses a personal prediction or opinion about the future.", exId: "'Will' untuk prediksi atau pendapat pribadi tentang masa depan." },
    { q: "This meeting is long. It probably ___ before lunch.", opts: ["isn't finishing","doesn't finish","isn't going to finishing","won't finish"], a: 3, ex: "'Will/won't' with 'probably' gives a prediction or opinion.", exId: "'Will/won't' dengan 'probably' untuk prediksi atau opini." },
    { q: "The waiter is here. Hmm, I ___ have the chicken salad, please.", opts: ["will","am having","have","will having"], a: 0, ex: "Decisions made now, like ordering food, use 'will'.", exId: "Keputusan mendadak, seperti memesan makanan, pakai 'will'." },
    { q: "I can't open this jar. Give it to me, I ___ try.", opts: ["try","am trying","will","am going to trying"], a: 2, ex: "'Will' for an offer or an instant decision to help.", exId: "'Will' untuk menawarkan bantuan atau keputusan spontan." },
    { q: "Why are you carrying that ladder? I ___ the roof this afternoon.", opts: ["will fix","am going to fix","fix","will be fix"], a: 1, ex: "Evidence of a prior plan (carrying a ladder) needs 'going to'.", exId: "Bukti rencana yang sudah ada (membawa tangga) butuh 'going to'." },
    { q: "Have you decided about the job offer? Yes, I ___ accept it.", opts: ["am going to","accept","will accepting","am accept"], a: 0, ex: "A decision already made ('have you decided? yes') uses 'going to'.", exId: "Keputusan yang sudah diambil ('sudah memutuskan? Ya') pakai 'going to'." },
    { q: "Look at those dark clouds! It ___ rain very soon.", opts: ["will","rains","is going to","is raining"], a: 2, ex: "Present evidence (dark clouds) means 'going to' for a prediction.", exId: "Bukti sekarang (awan gelap) berarti 'going to' untuk prediksi." },
    { q: "Be careful with that pile, you ___ drop those plates!", opts: ["will drop","drop","are going to drop","are dropping"], a: 2, ex: "Something about to happen now, with evidence, uses 'going to'.", exId: "Sesuatu yang hampir terjadi sekarang, ada bukti, pakai 'going to'." },
    { q: "Watch out! That glass ___ fall off the edge of the table!", opts: ["falls","is going to","will","is falling"], a: 1, ex: "An event about to happen (you can see it) uses 'going to'.", exId: "Kejadian yang hampir terjadi (terlihat) pakai 'going to'." },
    { q: "I've made a firm decision: I ___ money on games any more.", opts: ["am not going to waste","will not going to waste","am not go to waste","not going to waste"], a: 0, ex: "A firm decision already made uses 'going to'.", exId: "Keputusan yang sudah bulat pakai 'going to'." },
    { q: "I ___ a short holiday next month; I've been planning it for weeks.", opts: ["will taking","go to take","am go to take","am going to take"], a: 3, ex: "A long-planned intention ('planning for weeks') uses 'going to'.", exId: "Niat yang sudah lama direncanakan pakai 'going to'." },
    { q: "My brother has bought lots of paint and brushes. He ___ his bedroom.", opts: ["will paint","paints","is going to paint","painting"], a: 2, ex: "Evidence of intention (he bought paint) means 'going to'.", exId: "Bukti niat (dia beli cat) berarti 'going to'." },
    { q: "The sky has gone completely dark and the wind is strong. There ___ a storm.", opts: ["is going to be","will","is","goes to be"], a: 0, ex: "Strong present evidence (dark sky, wind) means 'going to'.", exId: "Bukti kuat sekarang (langit gelap, angin) berarti 'going to'." },
    { q: "I can't come to your party. I ___ my parents at the airport at 9 pm.", opts: ["meet","will meet","am meeting","meets"], a: 2, ex: "Present continuous for a fixed personal arrangement at a set time.", exId: "Present continuous untuk janji/pengaturan tetap pada waktu tertentu." },
    { q: "Are you free on Friday evening? No, sorry, I ___ dinner with my boss.", opts: ["have","am having","will have","having"], a: 1, ex: "A planned social arrangement uses the present continuous.", exId: "Rencana sosial yang sudah diatur pakai present continuous." },
    { q: "Don't forget: we ___ the new clients tomorrow at ten o'clock sharp.", opts: ["will see","are seeing","see","seeing"], a: 1, ex: "A fixed business arrangement at a set time uses present continuous.", exId: "Pengaturan bisnis yang tetap pada waktu pasti pakai present continuous." },
    { q: "She ___ to Singapore on Monday; she has already packed her bags.", opts: ["flies","will fly","is flying","fly"], a: 2, ex: "A personal travel arrangement (bags packed) uses present continuous.", exId: "Rencana perjalanan pribadi (koper sudah dikemas) pakai present continuous." },
    { q: "I ___ the doctor at 4 o'clock today, so I must leave work early.", opts: ["see","will see","am see","am seeing"], a: 3, ex: "A booked appointment at a set time uses the present continuous.", exId: "Janji temu yang sudah dibuat pada waktu tertentu pakai present continuous." },
    { q: "My sister ___ married next June. They booked the hotel months ago.", opts: ["gets","is getting","will get","get"], a: 1, ex: "A planned event, already organised, uses the present continuous.", exId: "Acara yang sudah direncanakan dan diatur pakai present continuous." },
    { q: "Hurry up! The train ___ at exactly 6:15, and it never waits.", opts: ["leaves","is leaving","will leave","leave"], a: 0, ex: "Present simple for a timetable (trains, buses, flights).", exId: "Present simple untuk jadwal (kereta, bus, pesawat)." },
    { q: "According to the schedule, the plane ___ at 8:00 tomorrow morning.", opts: ["is taking off","takes off","will take off","take off"], a: 1, ex: "A fixed schedule ('according to the schedule') uses present simple.", exId: "Jadwal tetap ('menurut jadwal') pakai present simple." },
    { q: "The new shopping mall ___ at 10 a.m. every day, including weekends.", opts: ["is opening","will open","opens","open"], a: 2, ex: "Regular opening times (a timetable) take the present simple.", exId: "Jam buka rutin (jadwal) pakai present simple." },
    { q: "What time ___ the film start this evening, according to the website?", opts: ["does","is","will","has"], a: 0, ex: "Scheduled showtimes use present simple ('does ... start').", exId: "Jadwal tayang pakai present simple ('does ... start')." },
    { q: "We should go now. The last bus ___ in ten minutes and there's no other.", opts: ["is going","will go","going","goes"], a: 3, ex: "A bus timetable uses the present simple.", exId: "Jadwal bus pakai present simple." },
    { q: "My English class ___ at 9 and finishes at 11 every Monday.", opts: ["begins","is beginning","will begin","begin"], a: 0, ex: "A regular timetable (class times) uses the present simple.", exId: "Jadwal rutin (jam kelas) pakai present simple." },
    { q: "Don't phone me at 8 tonight, I ___ dinner then, and I hate interruptions.", opts: ["will have","have been having","will be having","have"], a: 2, ex: "Future continuous: an action in progress at a future time.", exId: "Future continuous: aksi yang sedang berlangsung pada waktu tertentu di masa depan." },
    { q: "This time next week, I ___ on a beach in Thailand. I can't wait!", opts: ["will lie","will be lying","lie","am lying"], a: 1, ex: "'This time next week' plus an ongoing action means future continuous.", exId: "'This time next week' plus aksi berlangsung berarti future continuous." },
    { q: "At 3 o'clock tomorrow we'll be in the middle of the exam; we ___ our answers then.", opts: ["will write","will be writing","write","are writing"], a: 1, ex: "In the middle of an activity at a future moment means future continuous.", exId: "Sedang di tengah aktivitas pada momen masa depan berarti future continuous." },
    { q: "This time tomorrow, the students ___ their final test in the exam hall.", opts: ["will take","take","will be taking","are taking"], a: 2, ex: "'This time tomorrow' with an ongoing action means future continuous.", exId: "'This time tomorrow' dengan aksi berlangsung berarti future continuous." },
    { q: "At midnight on New Year's Eve, we ___ and dancing at the party.", opts: ["sing","will sing","will be singing","are singing"], a: 2, ex: "An action in progress at a future point (midnight) means future continuous.", exId: "Aksi yang berlangsung pada titik masa depan (tengah malam) berarti future continuous." },
    { q: "Don't call between 2 and 4 pm; I ___ with clients the whole time.", opts: ["will meet","meet","will be meeting","have met"], a: 2, ex: "An action continuing across a future period means future continuous.", exId: "Aksi yang berlangsung sepanjang periode masa depan berarti future continuous." },
    { q: "Call me after 8 tonight. By then the children ___ , so the house will be quiet.", opts: ["will sleep","sleep","will be sleeping","are sleeping"], a: 2, ex: "An action in progress at a future time means future continuous ('will be V-ing').", exId: "Aksi yang berlangsung pada waktu masa depan berarti future continuous." },
    { q: "By the time you get back from work, I ___ cooking dinner.", opts: ["will finish","will have finished","am finishing","finish"], a: 1, ex: "Future perfect: completed before a future point ('by the time').", exId: "Future perfect: selesai sebelum satu titik di masa depan ('by the time')." },
    { q: "By the time the guests arrive, we ___ all the food.", opts: ["will prepare","will have prepared","prepare","are preparing"], a: 1, ex: "'By the time' plus a future point means future perfect (finished before then).", exId: "'By the time' plus titik masa depan berarti future perfect (selesai sebelum itu)." },
    { q: "By the time this course finishes, we ___ twelve grammar units.", opts: ["will study","study","will have studied","are studying"], a: 2, ex: "'By the time ... finishes' means future perfect for a completed result.", exId: "'By the time ... finishes' berarti future perfect untuk hasil yang selesai." },
    { q: "By the time you finish this book, you ___ a lot of new words.", opts: ["will learn","learn","will be learning","will have learned"], a: 3, ex: "Completed before a future point means future perfect ('will have V3').", exId: "Selesai sebelum titik masa depan berarti future perfect ('will have V3')." },
    { q: "Hurry! By the time we get to the cinema, the film ___ .", opts: ["will start","starts","will have started","is starting"], a: 2, ex: "An action completed before your arrival means future perfect.", exId: "Aksi yang sudah terjadi sebelum kamu tiba berarti future perfect." },
    { q: "By the time our children grow up, technology ___ the world completely.", opts: ["will change","will have changed","changes","is changing"], a: 1, ex: "A change completed before a future point means future perfect.", exId: "Perubahan yang selesai sebelum titik masa depan berarti future perfect." },
    { q: "Call me at nine. By then I ___ my homework, so I'll be free.", opts: ["will finish","will have finished","finish","am finishing"], a: 1, ex: "'By then' (a future point) plus a completed action means future perfect.", exId: "'By then' (titik masa depan) plus aksi selesai berarti future perfect." },
    { q: "By the time the train reaches Surabaya, we ___ for eight hours without a break.", opts: ["will travel","will be travelling","will have been travelling","travel"], a: 2, ex: "Future perfect continuous: duration up to a future point ('for eight hours').", exId: "Future perfect continuous: durasi sampai satu titik masa depan ('selama delapan jam')." },
    { q: "Next July, I ___ at this company for exactly ten years.", opts: ["will have been working","will work","am working","will be working"], a: 0, ex: "Duration continuing up to a future time means future perfect continuous.", exId: "Durasi yang berlanjut sampai waktu masa depan berarti future perfect continuous." },
    { q: "By six o'clock this evening, the children ___ video games for four hours!", opts: ["will play","are playing","will be playing","will have been playing"], a: 3, ex: "Emphasising how long an activity has continued up to a point means future perfect continuous.", exId: "Menekankan berapa lama aktivitas berlangsung sampai satu titik berarti future perfect continuous." },
    { q: "When she retires next year, my aunt ___ as a nurse for over thirty years.", opts: ["will work","will be working","will have been working","works"], a: 2, ex: "A long duration up to a future event means future perfect continuous.", exId: "Durasi panjang sampai kejadian masa depan berarti future perfect continuous." },
    { q: "Which sentence is correct?", opts: ["This time tomorrow I will flying to London.","This time tomorrow I will be flying to London.","This time tomorrow I will flew to London."], a: 1, ex: "Future continuous is 'will be' plus the verb-ing form.", exId: "Future continuous adalah 'will be' plus bentuk verb-ing." },
    { q: "Which sentence is correct?", opts: ["By June, she will have finish the project.","By June, she will have finished the project.","By June, she will has finished the project."], a: 1, ex: "Future perfect is 'will have' plus the past participle (V3).", exId: "Future perfect adalah 'will have' plus past participle (V3)." },
    { q: "Which sentence is correct?", opts: ["When you will arrive, I will call a taxi.","When you arrive, I will call a taxi.","When you arriving, I will call a taxi."], a: 1, ex: "Use present simple, not 'will', in a future time clause after 'when'.", exId: "Pakai present simple, bukan 'will', di anak kalimat waktu setelah 'when'." },
    { q: "Which sentence is correct?", opts: ["Look at the time, we are going to be late!","Look at the time, we will going to be late!","Look at the time, we are going to being late!"], a: 0, ex: "'Going to' is am/is/are plus 'going to' plus the base verb.", exId: "'Going to' adalah am/is/are plus 'going to' plus kata kerja dasar." },
    { q: "Which sentence is correct?", opts: ["By 5 p.m. they will have been waiting for three hours.","By 5 p.m. they will have waiting for three hours.","By 5 p.m. they will been waiting for three hours."], a: 0, ex: "Future perfect continuous is 'will have been' plus the verb-ing form.", exId: "Future perfect continuous adalah 'will have been' plus bentuk verb-ing." },
    { q: "Which sentence is correct?", opts: ["The bus will leaves at 7 every morning.","The bus leaves at 7 every morning.","The bus leave at 7 every morning."], a: 1, ex: "A timetable uses present simple with correct subject-verb agreement.", exId: "Jadwal pakai present simple dengan agreement subjek-kata kerja yang benar." },
    { q: "A: We have run out of milk. B: Oh, I ___ some on my way home.", opts: ["am buying","will buy","buy","bought"], a: 1, ex: "Deciding at the moment of speaking uses 'will'.", exId: "Memutuskan saat berbicara pakai 'will'." },
    { q: "A: There's someone at the door. B: I ___ who it is.", opts: ["will see","see","am seeing","am going to see"], a: 0, ex: "Reacting now with an on-the-spot decision uses 'will'.", exId: "Reaksi spontan sekarang pakai 'will'." },
    { q: "You look thirsty. I ___ you a glass of water.", opts: ["get","am getting","will get","was getting"], a: 2, ex: "Offering to do something now uses 'will'.", exId: "Menawarkan melakukan sesuatu sekarang pakai 'will'." },
    { q: "A: I can't lift this table alone. B: Wait, I ___ you.", opts: ["help","will help","am helping","am going to help"], a: 1, ex: "An offer made at the moment uses 'will'.", exId: "Tawaran yang dibuat saat itu pakai 'will'." },
    { q: "I promise I ___ late for your party tonight.", opts: ["won't be","am not being","am not","don't be"], a: 0, ex: "A promise uses 'will' or 'won't'.", exId: "Janji pakai 'will' atau 'won't'." },
    { q: "Give me the keys. I ___ the door for you, I promise.", opts: ["will lock","am locking","lock","was locking"], a: 0, ex: "A promise to do something uses 'will'.", exId: "Janji melakukan sesuatu pakai 'will'." },
    { q: "I think our team ___ the match on Saturday.", opts: ["wins","will win","is winning","won"], a: 1, ex: "An opinion prediction (I think) uses 'will'.", exId: "Prediksi berdasarkan pendapat (I think) pakai 'will'." },
    { q: "I'm sure you ___ the exam. Don't worry so much.", opts: ["pass","will pass","are passing","passed"], a: 1, ex: "Predicting with 'I'm sure' uses 'will'.", exId: "Prediksi dengan 'I'm sure' pakai 'will'." },
    { q: "Maybe it ___ a nice day for our picnic tomorrow.", opts: ["is","will be","is being","was"], a: 1, ex: "An uncertain prediction (maybe) uses 'will'.", exId: "Prediksi tak pasti (maybe) pakai 'will'." },
    { q: "A: Why are you saving so much money? B: We ___ a new car.", opts: ["are going to buy","will buy","buy","bought"], a: 0, ex: "A plan decided before now uses 'going to'.", exId: "Rencana yang sudah diputuskan sebelumnya pakai 'going to'." },
    { q: "A: Have you decided about the holiday? B: Yes, we ___ in Bali.", opts: ["will stay","are going to stay","stay","stayed"], a: 1, ex: "An already-made decision uses 'going to'.", exId: "Keputusan yang sudah diambil pakai 'going to'." },
    { q: "She has bought new running shoes because she ___ a marathon.", opts: ["will run","runs","is going to run","ran"], a: 2, ex: "A planned intention uses 'going to'.", exId: "Niat yang sudah direncanakan pakai 'going to'." },
    { q: "We ___ the kitchen next month; we have already chosen the tiles.", opts: ["will redo","redo","are going to redo","redid"], a: 2, ex: "A decision made earlier uses 'going to'.", exId: "Keputusan yang dibuat lebih awal pakai 'going to'." },
    { q: "Careful! You ___ that glass of juice!", opts: ["will spill","spill","are going to spill","are spilling"], a: 2, ex: "Present evidence shows it will happen — use 'going to'.", exId: "Bukti sekarang menunjukkan akan terjadi — pakai 'going to'." },
    { q: "He hasn't studied at all this term. He ___ the test.", opts: ["will fail","is going to fail","fails","is failing"], a: 1, ex: "A prediction based on evidence uses 'going to'.", exId: "Prediksi dari bukti pakai 'going to'." },
    { q: "My phone battery is at one percent. It ___ off any second.", opts: ["is going to turn","will turn","turns","is turning"], a: 0, ex: "Present evidence (low battery) uses 'going to'.", exId: "Bukti sekarang (baterai lemah) pakai 'going to'." },
    { q: "We ___ to the theatre on Friday — the tickets are already booked.", opts: ["go","are going","will go","went"], a: 1, ex: "A booked arrangement uses present continuous.", exId: "Rencana yang sudah dipesan pakai present continuous." },
    { q: "They ___ dinner at our house tonight, so I must cook a lot.", opts: ["will have","have","are having","had"], a: 2, ex: "A planned social arrangement uses present continuous.", exId: "Rencana sosial yang sudah diatur pakai present continuous." },
    { q: "What time ___ your friends this evening? You said seven.", opts: ["do you meet","are you meeting","will you meet","did you meet"], a: 1, ex: "An arranged meeting uses present continuous.", exId: "Pertemuan yang sudah diatur pakai present continuous." },
    { q: "Our flight ___ at 6 a.m. every Monday, so we always wake up early.", opts: ["is leaving","will leave","leaves","left"], a: 2, ex: "A regular timetabled flight uses present simple.", exId: "Penerbangan terjadwal rutin pakai present simple." },
    { q: "When you arrive at eight, we ___ dinner, so just come in.", opts: ["have","will be having","are having","had"], a: 1, ex: "In progress at a future moment uses future continuous.", exId: "Sedang berlangsung pada saat mendatang pakai future continuous." },
    { q: "This time next week, we ___ across the mountains.", opts: ["are driving","drive","will be driving","drove"], a: 2, ex: "An action happening at a future point uses future continuous.", exId: "Aksi yang terjadi pada titik mendatang pakai future continuous." },
    { q: "By the time you arrive, I ___ dinner.", opts: ["will cook","will be cooking","will have cooked","cook"], a: 2, ex: "Completed before a future point uses future perfect.", exId: "Selesai sebelum titik mendatang pakai future perfect." },
    { q: "By 2030, engineers ___ the new bridge over the river.", opts: ["will be building","will have built","are building","build"], a: 1, ex: "Finished before a future date uses future perfect.", exId: "Selesai sebelum tanggal mendatang pakai future perfect." },
    { q: "The train leaves at six, and by seven we ___ the city.", opts: ["will be leaving","will have left","leave","left"], a: 1, ex: "An action complete before a future time uses future perfect.", exId: "Aksi selesai sebelum waktu mendatang pakai future perfect." },
    { q: "Don't come before noon; I ___ the house by then.", opts: ["won't clean","won't have cleaned","am not cleaning","don't clean"], a: 1, ex: "Not finished before a future point uses future perfect.", exId: "Belum selesai sebelum titik mendatang pakai future perfect." },
    { q: "By December, we ___ in this house for exactly five years.", opts: ["will live","will be living","are living","will have been living"], a: 3, ex: "Duration continuing up to a future point uses future perfect continuous.", exId: "Durasi yang berlangsung sampai titik mendatang pakai future perfect continuous." },
    { q: "By next month, she ___ English at our school for ten years.", opts: ["will have been teaching","will teach","teaches","is teaching"], a: 0, ex: "Emphasising how long up to a future time uses future perfect continuous.", exId: "Menekankan berapa lama sampai waktu mendatang pakai future perfect continuous." },
    { q: "By the time the race ends, they ___ for three hours.", opts: ["will run","will be running","will have been running","run"], a: 2, ex: "Duration up to a future point uses future perfect continuous.", exId: "Durasi sampai titik mendatang pakai future perfect continuous." },
    { q: "When you finally wake up at noon, I ___ since six o'clock.", opts: ["will have been working","will work","am working","work"], a: 0, ex: "Ongoing duration up to a future moment uses future perfect continuous.", exId: "Durasi yang berlangsung sampai saat mendatang pakai future perfect continuous." },
    { q: "Which sentence is correct?", opts: ["I see the dentist at four tomorrow; it's all arranged.","I am seeing the dentist at four tomorrow; it's all arranged.","I will see the dentist at four tomorrow; it's all arranged."], a: 1, ex: "A fixed arrangement uses present continuous.", exId: "Janji yang sudah diatur pakai present continuous." },
    { q: "Which sentence is correct?", opts: ["Look out! You will fall off that chair!","Look out! You are going to fall off that chair!","Look out! You fall off that chair!"], a: 1, ex: "A prediction from present evidence uses 'going to'.", exId: "Prediksi dari bukti saat ini pakai 'going to'." },
    { q: "Which sentence is correct?", opts: ["By the time you return, I will finish the whole book.","By the time you return, I finish the whole book.","By the time you return, I will have finished the whole book."], a: 2, ex: "Completed before a future point uses future perfect.", exId: "Selesai sebelum titik mendatang pakai future perfect." },
  ],
  9: [
    { q: "The office ___ every morning before the staff arrive.", opts: ["cleans","is cleaned","is cleaning"], a: 1, ex: "Present simple passive: is/are + past participle for regular routines.", exId: "Passive present simple: is/are + V3 untuk kegiatan rutin." },
    { q: "These phones ___ in China and sold in many countries.", opts: ["are made","make","are making"], a: 0, ex: "Use are + V3 for a general fact in the present.", exId: "Pakai are + V3 untuk fakta umum di present simple." },
    { q: "English ___ in offices all over the world.", opts: ["is spoken","speaks","is speaking"], a: 0, ex: "Present simple passive states a general truth: is + V3.", exId: "Passive present simple menyatakan kebenaran umum: is + V3." },
    { q: "Train tickets ___ at the station and online.", opts: ["sell","are sold","is sold"], a: 1, ex: "Plural subject takes are + V3 in the present passive.", exId: "Subjek jamak memakai are + V3 pada passive present." },
    { q: "In this company, all emails ___ in English.", opts: ["write","are writing","are written"], a: 2, ex: "Present simple passive: are + V3 for a fixed rule.", exId: "Passive present simple: are + V3 untuk aturan tetap." },
    { q: "Breakfast ___ between seven and ten every day.", opts: ["is served","serves","is serving"], a: 0, ex: "Daily routine in the present passive: is + V3.", exId: "Rutinitas harian dalam passive present: is + V3." },
    { q: "Please wait outside. The meeting room ___ right now.", opts: ["is cleaned","is being cleaned","cleans"], a: 1, ex: "Present continuous passive: is being + V3 for now.", exId: "Passive present continuous: is being + V3 untuk saat ini." },
    { q: "I can't use my laptop because it ___ at the moment.", opts: ["is repaired","is being repaired","repairs"], a: 1, ex: "Action in progress now: is being + past participle.", exId: "Aksi sedang berlangsung sekarang: is being + V3." },
    { q: "Look! A new bridge ___ over the river these days.", opts: ["is built","is being built","builds"], a: 1, ex: "Use is being + V3 for something happening around now.", exId: "Pakai is being + V3 untuk hal yang sedang terjadi." },
    { q: "The report isn't ready yet; it ___ by the finance team now.", opts: ["is checked","is being checked","checks"], a: 1, ex: "Present continuous passive shows an action happening now.", exId: "Passive present continuous menunjukkan aksi yang berlangsung sekarang." },
    { q: "Sorry for the noise. The road outside ___ this week.", opts: ["is repaired","repairs","is being repaired"], a: 2, ex: "Ongoing action around now: is being + V3.", exId: "Aksi berlangsung di sekitar sekarang: is being + V3." },
    { q: "The new library ___ in 2015.", opts: ["was built","built","was building"], a: 0, ex: "Past simple passive: was/were + V3 with a past time.", exId: "Passive past simple: was/were + V3 dengan waktu lampau." },
    { q: "My wallet ___ on the bus yesterday.", opts: ["was stolen","stole","was stealing"], a: 0, ex: "Finished past action, unknown doer: was + V3.", exId: "Aksi lampau selesai, pelaku tak diketahui: was + V3." },
    { q: "These photos ___ during our trip to Japan last summer.", opts: ["were taken","took","were taking"], a: 0, ex: "Plural subject in the past passive: were + V3.", exId: "Subjek jamak pada passive past: were + V3." },
    { q: "The email ___ to the wrong person this morning.", opts: ["sent","was sent","was sending"], a: 1, ex: "Past simple passive: was + V3 for a completed action.", exId: "Passive past simple: was + V3 untuk aksi yang selesai." },
    { q: "All the concert tickets ___ before I could buy one.", opts: ["were sold","was sold","were selling"], a: 0, ex: "Plural subject needs were + V3 in the past passive.", exId: "Subjek jamak butuh were + V3 pada passive past." },
    { q: "The bill ___ by my colleague after dinner last night.", opts: ["paid","was paying","was paid"], a: 2, ex: "Past simple passive: was + V3, doer shown by 'by'.", exId: "Passive past simple: was + V3, pelaku ditandai 'by'." },
    { q: "The walls were still wet because the house ___ when we arrived.", opts: ["was painted","was being painted","painted"], a: 1, ex: "Action in progress in the past: was being + V3.", exId: "Aksi berlangsung di masa lampau: was being + V3." },
    { q: "While the meal ___, the guests waited in the garden.", opts: ["was prepared","was being prepared","prepared"], a: 1, ex: "'While' + past continuous passive: was being + V3.", exId: "'While' + passive past continuous: was being + V3." },
    { q: "I couldn't log in because my account ___ at that moment.", opts: ["was fixed","was being fixed","fixed"], a: 1, ex: "Ongoing past action: was being + past participle.", exId: "Aksi lampau yang berlangsung: was being + V3." },
    { q: "The road was closed because a broken pipe ___ at the time.", opts: ["was repaired","repaired","was being repaired"], a: 2, ex: "Past continuous passive for an action in progress then.", exId: "Passive past continuous untuk aksi yang berlangsung saat itu." },
    { q: "The room looks great! It ___ this morning.", opts: ["has been cleaned","is cleaned","cleans"], a: 0, ex: "Present perfect passive: has/have been + V3, present result.", exId: "Passive present perfect: has/have been + V3, hasil kini." },
    { q: "You can log in now — your password ___.", opts: ["has been reset","is resetting","resets"], a: 0, ex: "Recent action with a present result: has been + V3.", exId: "Aksi baru dengan hasil sekarang: has been + V3." },
    { q: "So far this year, three new branches ___ in our city.", opts: ["have been opened","are opened","were opening"], a: 0, ex: "'So far' signals present perfect passive: have been + V3.", exId: "'So far' menandai passive present perfect: have been + V3." },
    { q: "The website is offline because it ___ yet.", opts: ["hasn't been updated","isn't updated","didn't update"], a: 0, ex: "'Yet' needs present perfect: has/have (not) been + V3.", exId: "'Yet' butuh present perfect: has/have (not) been + V3." },
    { q: "My phone works well now that the software ___.", opts: ["has been updated","is updating","updates"], a: 0, ex: "Present result of a recent action: has been + V3.", exId: "Hasil kini dari aksi baru: has been + V3." },
    { q: "Since last Monday, several changes ___ to the schedule.", opts: ["are made","were making","have been made"], a: 2, ex: "'Since' requires present perfect passive: have been + V3.", exId: "'Since' butuh passive present perfect: have been + V3." },
    { q: "By the time we arrived, the meeting ___.", opts: ["had already been cancelled","was cancelling","is cancelled"], a: 0, ex: "Past perfect passive: had been + V3 for the earlier past.", exId: "Passive past perfect: had been + V3 untuk lampau lebih awal." },
    { q: "She was upset because her seat ___ to someone else.", opts: ["had been given","was giving","is given"], a: 0, ex: "Earlier past action explained with had been + V3.", exId: "Aksi lampau lebih awal dijelaskan dengan had been + V3." },
    { q: "When I opened the box, the phone ___ already.", opts: ["had been damaged","was damaging","is damaged"], a: 0, ex: "Action before another past action: had been + V3.", exId: "Aksi sebelum aksi lampau lain: had been + V3." },
    { q: "The thief was gone. The money ___ before the police came.", opts: ["had been taken","was taking","has been taken"], a: 0, ex: "Earlier past than 'came': past perfect passive, had been + V3.", exId: "Lebih lampau dari 'came': passive past perfect, had been + V3." },
    { q: "By 2010, the old factory ___ into a shopping centre.", opts: ["was turning","is turned","had been turned"], a: 2, ex: "'By 2010' with an earlier past: had been + V3.", exId: "'By 2010' dengan lampau lebih awal: had been + V3." },
    { q: "Don't worry. The results ___ to you by email next week.", opts: ["will be sent","are sent","were sent"], a: 0, ex: "Future passive: will be + V3 for a future action.", exId: "Passive future: will be + V3 untuk aksi mendatang." },
    { q: "The new road ___ before the end of the year.", opts: ["will be finished","is finished","was finished"], a: 0, ex: "Future passive uses will be + past participle.", exId: "Passive future memakai will be + V3." },
    { q: "If you order today, your parcel ___ tomorrow.", opts: ["will be delivered","is delivering","was delivered"], a: 0, ex: "First conditional result: will be + V3 for the future.", exId: "Hasil first conditional: will be + V3 untuk masa depan." },
    { q: "Students ___ about the exam date next Monday.", opts: ["will be told","are told","told"], a: 0, ex: "Future passive: will be + V3 with a future time marker.", exId: "Passive future: will be + V3 dengan penanda waktu depan." },
    { q: "Your money ___ within three working days.", opts: ["returns","is returning","will be returned"], a: 2, ex: "Future passive: will be + V3 for a coming action.", exId: "Passive future: will be + V3 untuk aksi yang akan datang." },
    { q: "This medicine ___ in a cool, dry place.", opts: ["should be kept","should keep","is keeping"], a: 0, ex: "Modal passive: should/must + be + V3 for advice.", exId: "Passive modal: should/must + be + V3 untuk saran." },
    { q: "Passports ___ at the gate.", opts: ["must be shown","must show","are showing"], a: 0, ex: "Modal passive: must + be + V3 for a rule.", exId: "Passive modal: must + be + V3 untuk aturan." },
    { q: "The form ___ in black ink only.", opts: ["must be filled in","must fill in","fills in"], a: 0, ex: "Modal passive: must + be + V3, doer not important.", exId: "Passive modal: must + be + V3, pelaku tak penting." },
    { q: "This door ___ open during working hours.", opts: ["should be left","should leave","is leaving"], a: 0, ex: "Modal passive: should + be + V3 for a recommendation.", exId: "Passive modal: should + be + V3 untuk anjuran." },
    { q: "Your password ___ with anyone.", opts: ["should not be shared","should not share","is not sharing"], a: 0, ex: "Negative modal passive: should not + be + V3.", exId: "Passive modal negatif: should not + be + V3." },
    { q: "Seat belts ___ at all times in the car.", opts: ["must wear","are wearing","must be worn"], a: 2, ex: "Modal passive: must + be + V3 for an obligation.", exId: "Passive modal: must + be + V3 untuk kewajiban." },
    { q: "Which sentence is correct?", opts: ["The new office is build next year.","The new office will be built next year.","The new office will build next year."], a: 1, ex: "Future passive: will be + V3 (built), not 'build'.", exId: "Passive future: will be + V3 (built), bukan 'build'." },
    { q: "Which sentence is correct?", opts: ["The letters was sent yesterday.","The letters were send yesterday.","The letters were sent yesterday."], a: 2, ex: "Plural subject: were + V3 (sent) in past passive.", exId: "Subjek jamak: were + V3 (sent) pada passive past." },
    { q: "Which sentence is correct?", opts: ["My car is being repaired at the moment.","My car is repaired at the moment.","My car being repaired at the moment."], a: 0, ex: "Present continuous passive: is being + V3.", exId: "Passive present continuous: is being + V3." },
    { q: "Which sentence is correct?", opts: ["The report has been finish already.","The report has been finished already.","The report have been finished already."], a: 1, ex: "Present perfect passive: has been + V3 (finished).", exId: "Passive present perfect: has been + V3 (finished)." },
    { q: "Which sentence is correct?", opts: ["The dishes must be washed after every meal.","The dishes must washed after every meal.","The dishes must wash after every meal."], a: 0, ex: "Modal passive: must + be + V3 (washed).", exId: "Passive modal: must + be + V3 (washed)." },
    { q: "Which sentence is correct?", opts: ["The bridge was being built when the accident happened.","The bridge was build when the accident happened.","The bridge being built when the accident happened."], a: 0, ex: "Past continuous passive: was being + V3 (built).", exId: "Passive past continuous: was being + V3 (built)." },
    { q: "Make it passive: 'Someone cleans the office every day.'", opts: ["The office is cleaned every day.","The office is being cleaned every day.","The office cleans every day."], a: 0, ex: "Present simple active becomes is/are + V3 passive.", exId: "Present simple aktif menjadi passive is/are + V3." },
    { q: "Make it passive: 'They built this bridge in 1990.'", opts: ["This bridge is built in 1990.","This bridge was built in 1990.","This bridge was building in 1990."], a: 1, ex: "Past simple active becomes was/were + V3 passive.", exId: "Past simple aktif menjadi passive was/were + V3." },
    { q: "Make it passive: 'They will deliver the goods tomorrow.'", opts: ["The goods will deliver tomorrow.","The goods are delivered tomorrow.","The goods will be delivered tomorrow."], a: 2, ex: "Future active becomes will be + V3 in the passive.", exId: "Future aktif menjadi will be + V3 dalam passive." },
    { q: "Make it passive: 'The manager has approved your request.'", opts: ["Your request has been approved.","Your request is approved.","Your request had been approved."], a: 0, ex: "Present perfect active becomes has/have been + V3 passive.", exId: "Present perfect aktif menjadi passive has/have been + V3." },
    { q: "Make it passive: 'People must follow the rules.'", opts: ["The rules must be followed.","The rules must follow.","The rules are followed."], a: 0, ex: "Modal active becomes modal + be + V3 in the passive.", exId: "Modal aktif menjadi modal + be + V3 dalam passive." },
    { q: "Rice ___ by farmers in many warm countries.", opts: ["grows","is grown","is growing"], a: 1, ex: "Present simple passive: is/are + V3 for facts; a 'by' phrase names the doer.", exId: "Passive present simple: is/are + V3 untuk fakta; frasa 'by' menyebut pelaku." },
    { q: "These biscuits ___ with butter, sugar, and flour.", opts: ["are made","make","are making"], a: 0, ex: "Present simple passive: is/are + V3; the biscuits do not do the action.", exId: "Passive present simple: is/are + V3; biskuit tidak melakukan aksinya." },
    { q: "English ___ in most schools in our city.", opts: ["teaches","is being taught","is taught"], a: 2, ex: "Present simple passive for a general fact; no 'now', so not the continuous form.", exId: "Passive present simple untuk fakta umum; tanpa 'now', bukan bentuk continuous." },
    { q: "The post ___ to our house every morning at eight.", opts: ["is delivered","delivers","deliver"], a: 0, ex: "Present simple passive: is/are + V3 for a daily routine when the doer is unimportant.", exId: "Passive present simple: is/are + V3 untuk rutinitas harian saat pelaku tidak penting." },
    { q: "Fresh bread ___ in this shop every single day.", opts: ["bakes","is baked","is baking"], a: 1, ex: "Present simple passive: is/are + V3 for a regular action; someone bakes the bread.", exId: "Passive present simple: is/are + V3 untuk aksi rutin; seseorang memanggang rotinya." },
    { q: "Football ___ by millions of people all over the world.", opts: ["plays","is played","is playing"], a: 1, ex: "Present simple passive: is/are + V3; a 'by' phrase shows the doer of the action.", exId: "Passive present simple: is/are + V3; frasa 'by' menunjukkan pelaku aksi." },
    { q: "Dinner ___ now, so it will be ready very soon.", opts: ["is being cooked","is cooked","cooks"], a: 0, ex: "Present continuous passive: is/are being + V3 for something happening right now.", exId: "Passive present continuous: is/are being + V3 untuk hal yang terjadi sekarang." },
    { q: "The old bridge ___ this week because it is not safe.", opts: ["is fixed","is being fixed","fixes"], a: 1, ex: "Present continuous passive: is/are being + V3 for an action in progress this week.", exId: "Passive present continuous: is/are being + V3 untuk aksi berlangsung minggu ini." },
    { q: "The cake ___ yesterday for my sister's birthday.", opts: ["was made","made","was making"], a: 0, ex: "Past simple passive: was/were + V3 for a finished past action; 'yesterday' shows past time.", exId: "Passive past simple: was/were + V3 untuk aksi lampau selesai; 'yesterday' menunjuk waktu lampau." },
    { q: "These houses ___ more than a hundred years ago.", opts: ["built","were built","were building"], a: 1, ex: "Past simple passive: was/were + V3; 'ago' marks a finished past action.", exId: "Passive past simple: was/were + V3; 'ago' menandai aksi lampau yang selesai." },
    { q: "The window ___ by the strong wind last night.", opts: ["was broken","broke","was breaking"], a: 0, ex: "Past simple passive: was/were + V3; a 'by' phrase needs the passive, not the active.", exId: "Passive past simple: was/were + V3; frasa 'by' butuh passive, bukan active." },
    { q: "The parcels ___ last Monday, so they should arrive soon.", opts: ["sent","were sent","were sending"], a: 1, ex: "Past simple passive: was/were + V3 for a finished past action; someone sent them.", exId: "Passive past simple: was/were + V3 untuk aksi lampau selesai; seseorang mengirimnya." },
    { q: "My old bike ___ from outside the shop last week.", opts: ["was stolen","stole","was stealing"], a: 0, ex: "Past simple passive: was/were + V3 when the doer is unknown; 'last week' is past.", exId: "Passive past simple: was/were + V3 saat pelaku tak diketahui; 'last week' waktu lampau." },
    { q: "The match ___ because of heavy rain last Sunday.", opts: ["cancelled","was cancelled","was cancelling"], a: 1, ex: "Past simple passive: was/were + V3 for a finished event in the past.", exId: "Passive past simple: was/were + V3 untuk kejadian lampau yang selesai." },
    { q: "The car ___ when the rain suddenly started.", opts: ["was washed","was being washed","washed"], a: 1, ex: "Past continuous passive: was/were being + V3 for an action interrupted in the past.", exId: "Passive past continuous: was/were being + V3 untuk aksi lampau yang terganggu." },
    { q: "The street ___ when we walked past it this morning.", opts: ["was being cleaned","was cleaned","cleaned"], a: 0, ex: "Past continuous passive: was/were being + V3 for an action happening as we passed.", exId: "Passive past continuous: was/were being + V3 untuk aksi berlangsung saat kami lewat." },
    { q: "The dishes ___ already, so the kitchen looks clean.", opts: ["were washed","have been washed","are washed"], a: 1, ex: "Present perfect passive: has/have been + V3 with 'already' for a present result.", exId: "Passive present perfect: has/have been + V3 dengan 'already' untuk hasil kini." },
    { q: "Don't touch the door; it ___ and is still wet.", opts: ["was just painted","is just painted","has just been painted"], a: 2, ex: "Present perfect passive: has/have been + V3 with 'just'; the result matters now.", exId: "Passive present perfect: has/have been + V3 dengan 'just'; hasilnya penting sekarang." },
    { q: "The homework ___ yet, so you cannot go outside.", opts: ["has not been finished","was not finished","is not finished"], a: 0, ex: "Present perfect passive: has/have been + V3; 'yet' needs the present perfect.", exId: "Passive present perfect: has/have been + V3; 'yet' butuh present perfect." },
    { q: "So far this month, two matches ___ because of the snow.", opts: ["have been cancelled","were cancelled","are cancelled"], a: 0, ex: "Present perfect passive: has/have been + V3; 'so far' means the time is unfinished.", exId: "Passive present perfect: has/have been + V3; 'so far' berarti waktunya belum selesai." },
    { q: "This old church ___ many times over the years.", opts: ["was repaired","has been repaired","is repaired"], a: 1, ex: "Present perfect passive: has/have been + V3 for actions up to now.", exId: "Passive present perfect: has/have been + V3 untuk aksi sampai sekarang." },
    { q: "The room was clean because it ___ earlier that day.", opts: ["was being cleaned","is cleaned","had been cleaned"], a: 2, ex: "Past perfect passive: had been + V3 for an action finished before a past point.", exId: "Passive past perfect: had been + V3 untuk aksi selesai sebelum titik lampau." },
    { q: "When I got home, dinner ___ already, so we ate at once.", opts: ["had been cooked","was cooking","has been cooked"], a: 0, ex: "Past perfect passive: had been + V3 for an action done before I got home.", exId: "Passive past perfect: had been + V3 untuk aksi selesai sebelum saya pulang." },
    { q: "The shop was empty because everything ___ by noon.", opts: ["was selling","had been sold","is sold"], a: 1, ex: "Past perfect passive: had been + V3 for an action completed before a past time.", exId: "Passive past perfect: had been + V3 untuk aksi selesai sebelum waktu lampau." },
    { q: "The results ___ tomorrow, so please wait until then.", opts: ["are announced","will be announced","will announce"], a: 1, ex: "Future passive: will be + V3 for an action that will happen later.", exId: "Passive future: will be + V3 untuk aksi yang akan terjadi nanti." },
    { q: "A new hospital ___ in our town next year.", opts: ["will be built","builds","will build"], a: 0, ex: "Future passive: will be + V3; the hospital does not build itself.", exId: "Passive future: will be + V3; rumah sakit tidak membangun dirinya sendiri." },
    { q: "Don't worry, your car ___ by Friday.", opts: ["repairs","will repair","will be repaired"], a: 2, ex: "Future passive: will be + V3 for something that will be done later.", exId: "Passive future: will be + V3 untuk hal yang akan dikerjakan nanti." },
    { q: "The prizes ___ at the end of the match tonight.", opts: ["will be given","give","will give"], a: 0, ex: "Future passive: will be + V3; the prizes receive the action.", exId: "Passive future: will be + V3; hadiah menerima aksinya." },
    { q: "These old streets ___ soon to make them safer.", opts: ["will clean","will be cleaned","cleans"], a: 1, ex: "Future passive: will be + V3 for a future action when the doer is unimportant.", exId: "Passive future: will be + V3 untuk aksi mendatang saat pelaku tidak penting." },
    { q: "This medicine ___ two times a day after meals.", opts: ["should take","should be taken","is taking"], a: 1, ex: "Modal passive: should be + V3 for advice; the medicine receives the action.", exId: "Passive modal: should be + V3 untuk saran; obatnya menerima aksinya." },
    { q: "Seat belts ___ at all times in a moving car.", opts: ["must be worn","must wear","are wearing"], a: 0, ex: "Modal passive: must be + V3 for a rule or necessity.", exId: "Passive modal: must be + V3 untuk aturan atau keharusan." },
    { q: "The homework ___ before you can watch television tonight.", opts: ["must finish","is finishing","must be finished"], a: 2, ex: "Modal passive: must be + V3; the homework receives the action.", exId: "Passive modal: must be + V3; PR-nya menerima aksinya." },
    { q: "These plates are hot and ___ with care.", opts: ["should be handled","should handle","are handling"], a: 0, ex: "Modal passive: should be + V3 for advice about how to do something.", exId: "Passive modal: should be + V3 untuk saran tentang cara melakukan sesuatu." },
    { q: "The gate ___ at night to keep the animals safe.", opts: ["is locking","must be locked","must lock"], a: 1, ex: "Modal passive: must be + V3 for necessity; the gate receives the action.", exId: "Passive modal: must be + V3 untuk keharusan; gerbangnya menerima aksinya." },
  ],
  10: [
    { q: "If it ___ tomorrow, we will cancel the picnic.", opts: ["would rain","rains","will rain"], a: 1, ex: "First conditional: use present simple in the if-clause.", exId: "First conditional: pakai present simple di klausa if." },
    { q: "If you send the file now, I ___ it to the client tomorrow.", opts: ["will show","would show","showed"], a: 0, ex: "First conditional result: will + base verb for a real future.", exId: "Hasil first conditional: will + kata kerja dasar untuk masa depan nyata." },
    { q: "We will miss the train if we ___ leave soon.", opts: ["won't","don't","wouldn't"], a: 1, ex: "First conditional if-clause uses present simple, not will.", exId: "Klausa if first conditional pakai present simple, bukan will." },
    { q: "If the bus is late tomorrow, I ___ a taxi to the office.", opts: ["would take","will take","take"], a: 1, ex: "First conditional: present in if-clause, will in the result.", exId: "First conditional: present di klausa if, will di hasil." },
    { q: "If she studies hard this month, she ___ the exam.", opts: ["passes","would pass","will pass"], a: 2, ex: "First conditional: likely real future result with will.", exId: "First conditional: hasil masa depan yang nyata pakai will." },
    { q: "You won't pass the interview if you ___ late.", opts: ["arrive","will arrive","arrived"], a: 0, ex: "After if, use present simple even for future meaning.", exId: "Setelah if, pakai present simple walau maknanya masa depan." },
    { q: "If I ___ enough money this week, I will buy the new phone.", opts: ["will save","saved","save"], a: 2, ex: "First conditional if-clause: present simple, no will.", exId: "Klausa if first conditional: present simple, tanpa will." },
    { q: "If the shop ___ open at nine, we can buy the tickets early.", opts: ["will open","opens","opened"], a: 1, ex: "First conditional can use 'can' in the result clause.", exId: "First conditional boleh pakai 'can' di klausa hasil." },
    { q: "They will lose the client if the report ___ ready by Friday.", opts: ["won't be","isn't","wouldn't be"], a: 1, ex: "Use present simple after if, even with future time words.", exId: "Pakai present simple setelah if, walau ada kata waktu masa depan." },
    { q: "If you ___ this button, the machine will start.", opts: ["press","will press","pressed"], a: 0, ex: "After if, present simple; will goes in the result clause.", exId: "Setelah if, present simple; will di klausa hasil." },
    { q: "If we don't hurry, we ___ the last train home.", opts: ["would miss","will miss","miss"], a: 1, ex: "First conditional predicts a real future result with will.", exId: "First conditional memprediksi hasil masa depan nyata pakai will." },
    { q: "The teacher ___ angry if the students forget their homework tomorrow.", opts: ["is","would be","will be"], a: 2, ex: "First conditional: will + be for a real future result.", exId: "First conditional: will + be untuk hasil masa depan nyata." },
    { q: "If my phone ___ enough battery, I will call you tonight.", opts: ["has","will have","would have"], a: 0, ex: "First conditional if-clause uses present simple 'has'.", exId: "Klausa if first conditional pakai present simple 'has'." },
    { q: "If I ___ more free time, I would travel around Asia.", opts: ["will have","had","would have"], a: 1, ex: "Second conditional: past simple in if-clause for an unreal present.", exId: "Second conditional: past simple di klausa if untuk keadaan tidak nyata sekarang." },
    { q: "If I ___ you, I would accept the job offer.", opts: ["were","am","will be"], a: 0, ex: "Use 'were' for all subjects in unreal second conditionals.", exId: "Pakai 'were' untuk semua subjek di second conditional tidak nyata." },
    { q: "She ___ a car if she had enough money.", opts: ["will buy","bought","would buy"], a: 2, ex: "Second conditional result: would + base verb.", exId: "Hasil second conditional: would + kata kerja dasar." },
    { q: "If the ticket ___ cheaper, we would fly instead of taking the bus.", opts: ["is","were","will be"], a: 1, ex: "Second conditional uses past/were for an unreal situation.", exId: "Second conditional pakai past/were untuk situasi tidak nyata." },
    { q: "If we lived closer to the office, we ___ walk to work every day.", opts: ["can","could","will"], a: 1, ex: "Second conditional can use could for ability in an unreal present.", exId: "Second conditional boleh pakai could untuk kemampuan di keadaan tidak nyata." },
    { q: "I would tell you the answer if I ___ it.", opts: ["knew","know","would know"], a: 0, ex: "Second conditional if-clause: past simple, not would.", exId: "Klausa if second conditional: past simple, bukan would." },
    { q: "If he worked in a bigger company, he ___ earn more money.", opts: ["will","would","would have"], a: 1, ex: "Second conditional result uses would for an imagined situation.", exId: "Hasil second conditional pakai would untuk situasi khayalan." },
    { q: "If I won the lottery, I ___ my own business.", opts: ["will start","would have started","would start"], a: 2, ex: "Second conditional: unreal present/future result with would.", exId: "Second conditional: hasil tidak nyata pakai would." },
    { q: "What would you do if you ___ your passport while travelling?", opts: ["lose","would lose","lost"], a: 2, ex: "Second conditional if-clause uses past simple.", exId: "Klausa if second conditional pakai past simple." },
    { q: "If our team ___ bigger, we could finish the project faster.", opts: ["is","will be","were"], a: 2, ex: "Second conditional: were + could for an unreal present.", exId: "Second conditional: were + could untuk keadaan sekarang yang tidak nyata." },
    { q: "She ___ more comfortable if she took the train instead of the plane.", opts: ["would feel","will feel","felt"], a: 0, ex: "Second conditional result: would + base verb.", exId: "Hasil second conditional: would + kata kerja dasar." },
    { q: "If I ___ the manager, I would give everyone an extra day off.", opts: ["would be","am","were"], a: 2, ex: "Use 'were' after if for an imagined role or situation.", exId: "Pakai 'were' setelah if untuk peran atau situasi khayalan." },
    { q: "If our office ___ closer to my home, I wouldn't need to drive.", opts: ["is","were","will be"], a: 1, ex: "Second conditional: past/were for an unreal present situation.", exId: "Second conditional: past/were untuk keadaan sekarang yang tidak nyata." },
    { q: "If I had known about the meeting, I ___ earlier.", opts: ["would come","would have come","will come"], a: 1, ex: "Third conditional result: would have + past participle.", exId: "Hasil third conditional: would have + past participle (V3)." },
    { q: "She would have passed the test if she ___ more.", opts: ["studied","had studied","would study"], a: 1, ex: "Third conditional if-clause: past perfect for the unreal past.", exId: "Klausa if third conditional: past perfect untuk masa lalu tidak nyata." },
    { q: "If we ___ the earlier flight, we wouldn't have missed the meeting.", opts: ["took","had taken","take"], a: 1, ex: "Third conditional uses past perfect after if.", exId: "Third conditional pakai past perfect setelah if." },
    { q: "If you had saved the file, you ___ your work.", opts: ["wouldn't have lost","wouldn't lose","won't lose"], a: 0, ex: "Third conditional: would (not) have + past participle.", exId: "Third conditional: would (not) have + past participle." },
    { q: "They ___ the train if they had left the house on time.", opts: ["could catch","can catch","could have caught"], a: 2, ex: "Third conditional can use could have + past participle.", exId: "Third conditional boleh pakai could have + past participle." },
    { q: "If the shop ___ my card, I would have bought the laptop yesterday.", opts: ["accepts","accepted","had accepted"], a: 2, ex: "Third conditional if-clause uses past perfect.", exId: "Klausa if third conditional pakai past perfect." },
    { q: "I ___ you last night if I had had your number.", opts: ["would have called","would call","called"], a: 0, ex: "Third conditional: would have + past participle for the unreal past.", exId: "Third conditional: would have + past participle untuk masa lalu tidak nyata." },
    { q: "If he had checked the map, he ___ the wrong way.", opts: ["wouldn't go","wouldn't have gone","doesn't go"], a: 1, ex: "Third conditional result: would not have + past participle.", exId: "Hasil third conditional: would not have + past participle." },
    { q: "We might have won the game if our best player ___ injured.", opts: ["wasn't","hadn't been","isn't"], a: 1, ex: "Third conditional: past perfect (negative) after if.", exId: "Third conditional: past perfect (negatif) setelah if." },
    { q: "If I had booked the hotel earlier, it ___ so expensive.", opts: ["wouldn't be","wouldn't have been","isn't"], a: 1, ex: "Third conditional: would have been for an unreal past result.", exId: "Third conditional: would have been untuk hasil masa lalu tidak nyata." },
    { q: "If she ___ the instructions, she wouldn't have broken the machine.", opts: ["had read","read","would read"], a: 0, ex: "Third conditional needs past perfect in the if-clause.", exId: "Third conditional butuh past perfect di klausa if." },
    { q: "You ___ a better seat if you had arrived at the station sooner.", opts: ["would get","got","would have got"], a: 2, ex: "Third conditional: would have + past participle.", exId: "Third conditional: would have + past participle." },
    { q: "If the company ___ more staff last year, the project would have finished on time.", opts: ["hired","had hired","hires"], a: 1, ex: "Third conditional if-clause: past perfect for a past unreal condition.", exId: "Klausa if third conditional: past perfect untuk syarat masa lalu tidak nyata." },
    { q: "If I had studied medicine, I ___ a doctor now.", opts: ["would have been","would be","will be"], a: 1, ex: "Mixed conditional: past condition, present result with would + base.", exId: "Mixed conditional: syarat masa lalu, hasil sekarang pakai would + kata kerja dasar." },
    { q: "If she had taken that job, she ___ in London today.", opts: ["would have lived","lived","would live"], a: 2, ex: "Mixed conditional: 'today' shows a present result of a past condition.", exId: "Mixed conditional: 'today' menandai hasil sekarang dari syarat masa lalu." },
    { q: "If we had saved more money, we ___ our own house now.", opts: ["would own","would have owned","own"], a: 0, ex: "Mixed conditional result uses would + base verb for now.", exId: "Hasil mixed conditional pakai would + kata kerja dasar untuk sekarang." },
    { q: "If he hadn't missed the flight, he ___ here with us right now.", opts: ["would have been","would be","is"], a: 1, ex: "Mixed conditional: past condition, present result with would be.", exId: "Mixed conditional: syarat masa lalu, hasil sekarang pakai would be." },
    { q: "If I ___ the earlier train this morning, I wouldn't be so tired now.", opts: ["took","had taken","take"], a: 1, ex: "Mixed conditional if-clause: past perfect for a past cause.", exId: "Klausa if mixed conditional: past perfect untuk penyebab masa lalu." },
    { q: "If you had learned English earlier, you ___ more confident at work today.", opts: ["would have felt","felt","would feel"], a: 2, ex: "Mixed conditional: a past condition leads to a present result.", exId: "Mixed conditional: syarat masa lalu menghasilkan keadaan sekarang." },
    { q: "If they had booked the tour, they ___ on the beach right now.", opts: ["will be","would be","would have been"], a: 1, ex: "Mixed conditional: would + base for a present result now.", exId: "Mixed conditional: would + kata kerja dasar untuk hasil sekarang." },
    { q: "If I ___ my keys at home this morning, I could get into the office now.", opts: ["hadn't left","didn't leave","don't leave"], a: 0, ex: "Mixed conditional if-clause: past perfect (negative) for a past action.", exId: "Klausa if mixed conditional: past perfect (negatif) untuk tindakan masa lalu." },
    { q: "She wouldn't have this problem now if she ___ the manual last week.", opts: ["read","had read","reads"], a: 1, ex: "Mixed conditional: past perfect condition, present result.", exId: "Mixed conditional: syarat past perfect, hasil sekarang." },
    { q: "If we hadn't sold the car, we ___ to drive to the mountains this weekend.", opts: ["would be able","would have been able","will be able"], a: 0, ex: "Mixed conditional: past condition affecting a present/near result.", exId: "Mixed conditional: syarat masa lalu memengaruhi hasil sekarang/dekat." },
    { q: "Which sentence is correct? (talking about the weather)", opts: ["If it rains tomorrow, we will stay at home.","If it will rain tomorrow, we stay at home.","If it rained tomorrow, we will stay at home."], a: 0, ex: "First conditional: present simple after if, will in the result.", exId: "First conditional: present simple setelah if, will di hasil." },
    { q: "Which sentence is correct? (imagining owning a car)", opts: ["If I had a car, I would drive to work.","If I have a car, I would drive to work.","If I had a car, I will drive to work."], a: 0, ex: "Second conditional: past simple in the if-clause, would in the result.", exId: "Second conditional: past simple di klausa if, would di hasil." },
    { q: "Which sentence is correct? (about a missed phone call)", opts: ["If she had called me, I would have helped her.","If she had called me, I would helped her.","If she would have called me, I would have helped her."], a: 0, ex: "Third conditional: past perfect after if, would have + V3 in result.", exId: "Third conditional: past perfect setelah if, would have + V3 di hasil." },
    { q: "Which sentence is correct? (feeling tired today)", opts: ["If I had slept earlier, I wouldn't be tired now.","If I had slept earlier, I wouldn't have been tired now.","If I had slept earlier, I won't be tired now."], a: 0, ex: "Mixed conditional: past perfect condition, would + base for now.", exId: "Mixed conditional: syarat past perfect, would + kata kerja dasar untuk sekarang." },
    { q: "Which sentence is correct? (asking for help at work)", opts: ["If you will help me, the work goes faster.","If you help me, the work will go faster.","If you helped me, the work will go faster."], a: 1, ex: "First conditional: if + present simple, then will + base verb.", exId: "First conditional: if + present simple, lalu will + kata kerja dasar." },
    { q: "Which sentence is correct? (about waiting for someone)", opts: ["If we would have known, we would have waited.","If we had known, we would waited.","If we had known, we would have waited."], a: 2, ex: "Third conditional: never use 'would have' in the if-clause.", exId: "Third conditional: jangan pakai 'would have' di klausa if." },
    { q: "If it rains tomorrow, we ___ the football match.", opts: ["will cancel","would cancel","cancelled"], a: 0, ex: "First conditional: real future; if + present simple, then will + base verb.", exId: "Conditional tipe 1: masa depan nyata; if + present simple, lalu will + kata kerja dasar." },
    { q: "If you finish your homework early, I ___ you to the park tonight.", opts: ["would take","will take","took"], a: 1, ex: "First conditional gives a real future result with will + base verb.", exId: "Conditional tipe 1 memberi hasil masa depan nyata dengan will + kata kerja dasar." },
    { q: "If the shop ___ open, I will buy some bread.", opts: ["is","will be","would be"], a: 0, ex: "In the first conditional if-clause use present simple, not will.", exId: "Di klausa if conditional tipe 1 pakai present simple, bukan will." },
    { q: "If she calls me tonight, I ___ her about the party.", opts: ["told","will tell","would tell"], a: 1, ex: "First conditional: real future; if + present simple, then will + base verb.", exId: "Conditional tipe 1: masa depan nyata; if + present simple, lalu will + kata kerja dasar." },
    { q: "If it ___ sunny this weekend, we will go hiking.", opts: ["is","will be","was"], a: 0, ex: "In the first conditional if-clause use present simple, not will.", exId: "Di klausa if conditional tipe 1 pakai present simple, bukan will." },
    { q: "You won't pass the test if you ___ study.", opts: ["don't","won't","didn't"], a: 0, ex: "In the first conditional if-clause use present simple, not will.", exId: "Di klausa if conditional tipe 1 pakai present simple, bukan will." },
    { q: "If I ___ time after work, I will cook dinner for us.", opts: ["have","will have","had"], a: 0, ex: "Because the result uses will, the if-clause must be present simple.", exId: "Karena hasilnya memakai will, klausa if harus present simple." },
    { q: "If the baby wakes up, the noise ___ her cry.", opts: ["would make","will make","made"], a: 1, ex: "First conditional: real future; if + present simple, then will + base verb.", exId: "Conditional tipe 1: masa depan nyata; if + present simple, lalu will + kata kerja dasar." },
    { q: "If I ___ rich, I would travel around the world.", opts: ["were","am","will be"], a: 0, ex: "Second conditional uses 'were' for every subject in unreal situations.", exId: "Conditional tipe 2 memakai 'were' untuk semua subjek pada situasi tak nyata." },
    { q: "If she had more money, she ___ a bigger flat.", opts: ["will rent","would rent","would have rented"], a: 1, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
    { q: "If we lived near the sea, we ___ every day.", opts: ["swam","would swim","will swim"], a: 1, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
    { q: "He ___ healthier if he ate less sugar.", opts: ["would be","will be","would have been"], a: 0, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
    { q: "If I spoke better English, I ___ for that job.", opts: ["would have applied","would apply","will apply"], a: 1, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
    { q: "If my brother ___ taller, he could join the team.", opts: ["were","is","will be"], a: 0, ex: "Second conditional uses 'were' for every subject in unreal situations.", exId: "Conditional tipe 2 memakai 'were' untuk semua subjek pada situasi tak nyata." },
    { q: "What ___ you do if you won the lottery?", opts: ["would","will","did"], a: 0, ex: "Second conditional: an unreal future with if + past simple and would.", exId: "Conditional tipe 2: masa depan tak nyata dengan if + past simple dan would." },
    { q: "If they ___ a car, they wouldn't take the bus every day.", opts: ["had","have","will have"], a: 0, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
    { q: "If I didn't feel tired, I ___ you clean the kitchen.", opts: ["will help","would have helped","would help"], a: 2, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
    { q: "If you had studied harder, you ___ the exam.", opts: ["would have passed","would pass","will pass"], a: 0, ex: "Third conditional: unreal past; if + past perfect, then would have + V3.", exId: "Conditional tipe 3: masa lampau tak nyata; if + past perfect, lalu would have + V3." },
    { q: "If I ___ earlier, I wouldn't have missed the train.", opts: ["left","had left","would leave"], a: 1, ex: "Third conditional if-clause uses past perfect, not past simple.", exId: "Klausa if conditional tipe 3 memakai past perfect, bukan past simple." },
    { q: "She would have called you if she ___ your number.", opts: ["knew","had known","would know"], a: 1, ex: "Third conditional if-clause uses past perfect, not past simple.", exId: "Klausa if conditional tipe 3 memakai past perfect, bukan past simple." },
    { q: "If we ___ the map, we wouldn't have got lost yesterday.", opts: ["had brought","brought","would bring"], a: 0, ex: "Third conditional if-clause uses past perfect, not past simple.", exId: "Klausa if conditional tipe 3 memakai past perfect, bukan past simple." },
    { q: "They ___ the game if the weather had been better.", opts: ["would win","would have won","won"], a: 1, ex: "Third conditional: unreal past; if + past perfect, then would have + V3.", exId: "Conditional tipe 3: masa lampau tak nyata; if + past perfect, lalu would have + V3." },
    { q: "If he had set an alarm, he ___ late for work.", opts: ["wouldn't have been","wouldn't be","won't be"], a: 0, ex: "Third conditional: unreal past; if + past perfect, then would have + V3.", exId: "Conditional tipe 3: masa lampau tak nyata; if + past perfect, lalu would have + V3." },
    { q: "We could have caught the bus if we ___ faster.", opts: ["had walked","walked","would walk"], a: 0, ex: "Third conditional if-clause uses past perfect, not past simple.", exId: "Klausa if conditional tipe 3 memakai past perfect, bukan past simple." },
    { q: "If she ___ the recipe, the cake wouldn't have burned.", opts: ["followed","would follow","had followed"], a: 2, ex: "Third conditional if-clause uses past perfect, not past simple.", exId: "Klausa if conditional tipe 3 memakai past perfect, bukan past simple." },
    { q: "If you had asked me, I ___ you with the homework last night.", opts: ["helped","would help","would have helped"], a: 2, ex: "Third conditional: unreal past; if + past perfect, then would have + V3.", exId: "Conditional tipe 3: masa lampau tak nyata; if + past perfect, lalu would have + V3." },
    { q: "If I had saved more money last year, I ___ a car now.", opts: ["would have","would have had","will have"], a: 0, ex: "Mixed conditional: past perfect condition, present result with would + base verb.", exId: "Mixed conditional: syarat past perfect, hasil sekarang dengan would + kata kerja dasar." },
    { q: "If I hadn't eaten so much at lunch, I ___ hungry now.", opts: ["would be","would have been","will be"], a: 0, ex: "Mixed conditional: past perfect condition, present result with would + base verb.", exId: "Mixed conditional: syarat past perfect, hasil sekarang dengan would + kata kerja dasar." },
    { q: "If we had bought the tickets earlier, we ___ in the cinema right now.", opts: ["would be sitting","would have sat","will sit"], a: 0, ex: "Mixed conditional: past perfect condition, present result with 'now' or 'right now'.", exId: "Mixed conditional: syarat past perfect, hasil sekarang dengan 'now' atau 'right now'." },
    { q: "If I had learned to drive, I ___ to work every day now.", opts: ["would drive","would have driven","will drive"], a: 0, ex: "Mixed conditional: past perfect condition, present result with would + base verb.", exId: "Mixed conditional: syarat past perfect, hasil sekarang dengan would + kata kerja dasar." },
    { q: "If you hadn't broken your leg, you ___ with us on the trip now.", opts: ["would have been","would be","will be"], a: 1, ex: "Mixed conditional: past perfect condition, present result with would + base verb.", exId: "Mixed conditional: syarat past perfect, hasil sekarang dengan would + kata kerja dasar." },
    { q: "If my sister had gone to bed earlier, she ___ so tired now.", opts: ["wouldn't be","wouldn't have been","won't be"], a: 0, ex: "Mixed conditional: past perfect condition, present result with 'now'.", exId: "Mixed conditional: syarat past perfect, hasil sekarang dengan 'now'." },
    { q: "If it weren't so cold, we ___ in the garden.", opts: ["will sit","would sit","would have sat"], a: 1, ex: "Second conditional: unreal present; if + past simple, then would + base verb.", exId: "Conditional tipe 2: masa kini tak nyata; if + past simple, lalu would + kata kerja dasar." },
  ],
  11: [
    { q: "When I was young, I ___ run very fast, but now I am too slow.", opts: ["can","could","will be able to"], a: 1, ex: "Use 'could' for general ability in the past.", exId: "Gunakan 'could' untuk kemampuan umum di masa lampau." },
    { q: "After I finish this English course, I ___ speak with clients easily.", opts: ["can","could","will be able to"], a: 2, ex: "For future ability use 'will be able to', not 'can'.", exId: "Untuk kemampuan di masa depan pakai 'will be able to', bukan 'can'." },
    { q: "I practised for years, so now I ___ read Japanese newspapers easily.", opts: ["will be able to","could","can"], a: 2, ex: "Use 'can' for present ability.", exId: "Gunakan 'can' untuk kemampuan saat ini." },
    { q: "The office was dark, but she ___ find the light switch without any help.", opts: ["could","was able to","can"], a: 1, ex: "For one successful past action use 'was/were able to'.", exId: "Untuk satu tindakan berhasil di masa lalu pakai 'was/were able to', bukan 'could'." },
    { q: "___ you swim when you were five years old?", opts: ["Can","Could","Will"], a: 1, ex: "Use 'could' to ask about past ability.", exId: "Gunakan 'could' untuk menanyakan kemampuan di masa lalu." },
    { q: "By next month, I ___ afford a new laptop if I keep saving my money.", opts: ["can","will be able to","could"], a: 1, ex: "For future ability use 'will be able to', not 'can'.", exId: "Untuk kemampuan di masa depan pakai 'will be able to', bukan 'can'." },
    { q: "I'm not sure where my phone is. It ___ be in my bag.", opts: ["must","might","will"], a: 1, ex: "Use 'might/may/could' for something uncertain.", exId: "Gunakan 'might/may/could' untuk sesuatu yang belum pasti." },
    { q: "The sky is dark, but I'm not certain - it ___ rain this afternoon.", opts: ["will","can","might"], a: 2, ex: "Use 'might/may/could' for something uncertain.", exId: "Gunakan 'might/may/could' untuk sesuatu yang belum pasti." },
    { q: "I ___ be a few minutes late tonight, but I'm really not sure yet.", opts: ["will","must","may"], a: 2, ex: "Use 'may/might/could' for something uncertain.", exId: "Gunakan 'may/might/could' untuk sesuatu yang belum pasti." },
    { q: "The weather report says tomorrow ___ definitely be sunny all day.", opts: ["might","will","could"], a: 1, ex: "Use 'will' for something you are certain about.", exId: "Gunakan 'will' untuk sesuatu yang sudah pasti." },
    { q: "I don't know where she is. She ___ be at work right now.", opts: ["will","can","could"], a: 2, ex: "Use 'could' for something that is possible but uncertain.", exId: "Gunakan 'could' untuk sesuatu yang mungkin tetapi belum pasti." },
    { q: "Take an umbrella - some reports say it ___ snow later today.", opts: ["will","might","must"], a: 1, ex: "Use 'might/may/could' for something uncertain.", exId: "Gunakan 'might/may/could' untuk sesuatu yang belum pasti." },
    { q: "The ground is wet this morning. It ___ rained during the night.", opts: ["must have","can't have","should have"], a: 0, ex: "'Must have + V3' = you are sure it happened.", exId: "'Must have + V3' = yakin sesuatu sudah terjadi." },
    { q: "He ___ passed that hard exam - he only studied for one hour.", opts: ["must have","can't have","should have"], a: 1, ex: "'Can't have + V3' = you are sure it did not happen.", exId: "'Can't have + V3' = yakin sesuatu tidak terjadi." },
    { q: "I'm not certain, but they ___ missed the train - they looked worried.", opts: ["must have","might have","can't have"], a: 1, ex: "'Might have + V3' = it possibly happened.", exId: "'Might have + V3' = mungkin terjadi." },
    { q: "Your keys are on the table. You ___ dropped them there earlier.", opts: ["must have","can't have","couldn't have"], a: 0, ex: "'Must have + V3' = you are sure it happened.", exId: "'Must have + V3' = yakin sesuatu sudah terjadi." },
    { q: "She wasn't at the office today. She ___ been sick, or maybe on holiday.", opts: ["must have","may have","can't have"], a: 1, ex: "'May have + V3' = it possibly happened.", exId: "'May have + V3' = mungkin terjadi." },
    { q: "The cake is all gone. Someone ___ eaten it.", opts: ["can't have","shouldn't have","must have"], a: 2, ex: "'Must have + V3' = you are sure it happened.", exId: "'Must have + V3' = yakin sesuatu sudah terjadi." },
    { q: "He got full marks without studying - he ___ cheated; it is the only explanation.", opts: ["can't have","might have","must have"], a: 2, ex: "'Must have + V3' = the only sure explanation.", exId: "'Must have + V3' = satu-satunya penjelasan yang pasti." },
    { q: "You saw him in London yesterday? That ___ been him - he is in Japan this month.", opts: ["must have","can't have","should have"], a: 1, ex: "'Can't have + V3' = you are sure it did not happen.", exId: "'Can't have + V3' = yakin sesuatu tidak terjadi." },
    { q: "In this job, all staff ___ wear a uniform. It is a company rule.", opts: ["must","might","could"], a: 0, ex: "Use 'must' for a strong rule or obligation.", exId: "Gunakan 'must' untuk aturan atau kewajiban yang kuat." },
    { q: "I ___ finish this report by Friday because my boss needs it for the meeting.", opts: ["might","could","have to"], a: 2, ex: "Use 'have to' for obligation from outside, like a boss.", exId: "Gunakan 'have to' untuk kewajiban dari luar, misalnya dari atasan." },
    { q: "Yesterday I ___ work late because the computer system had a big problem.", opts: ["must","had to","have to"], a: 1, ex: "Use 'had to' for obligation in the past.", exId: "Gunakan 'had to' untuk kewajiban di masa lalu." },
    { q: "You ___ book the train tickets soon, or they will sell out.", opts: ["need to","could","might"], a: 0, ex: "Use 'need to' to show something is necessary.", exId: "Gunakan 'need to' untuk menunjukkan sesuatu perlu dilakukan." },
    { q: "Students ___ bring their own laptops to the exam next week. The rules require it.", opts: ["might","could","must"], a: 2, ex: "Use 'must' for a strong rule or obligation.", exId: "Gunakan 'must' untuk aturan atau kewajiban yang kuat." },
    { q: "Last month we ___ pay extra money for the flight because we booked late.", opts: ["have to","had to","must"], a: 1, ex: "Use 'had to' for obligation in the past.", exId: "Gunakan 'had to' untuk kewajiban di masa lalu." },
    { q: "You look very tired today. You ___ go to bed early tonight.", opts: ["should","must have","could have"], a: 0, ex: "Use 'should' to give advice.", exId: "Gunakan 'should' untuk memberi saran." },
    { q: "I feel sick now. I ___ eaten so much cake at the party.", opts: ["should have","must have","shouldn't have"], a: 2, ex: "'Shouldn't have + V3' = you regret doing it.", exId: "'Shouldn't have + V3' = menyesal telah melakukannya." },
    { q: "I failed the test. I ___ studied harder last week.", opts: ["should have","shouldn't have","can't have"], a: 0, ex: "'Should have + V3' = regret about the past.", exId: "'Should have + V3' = menyesali sesuatu di masa lalu." },
    { q: "If you want good marks, you ___ review your notes every day.", opts: ["must have","could have","ought to"], a: 2, ex: "'Ought to' gives advice, like 'should'.", exId: "'Ought to' memberi saran, sama seperti 'should'." },
    { q: "We missed the bus this morning. We ___ left the house earlier.", opts: ["should have","must have","might have"], a: 0, ex: "'Should have + V3' = regret about the past.", exId: "'Should have + V3' = menyesali sesuatu di masa lalu." },
    { q: "Your phone battery is very low. You ___ charge it before we leave.", opts: ["should","should have","must have"], a: 0, ex: "Use 'should' to give advice for now.", exId: "Gunakan 'should' untuk memberi saran saat ini." },
    { q: "The shop closes very soon. We ___ hurry.", opts: ["had better","would rather","must have"], a: 0, ex: "'Had better' gives a strong warning about now/future.", exId: "'Had better' memberi peringatan kuat untuk sekarang/nanti." },
    { q: "You ___ tell anyone my secret, or I will be very angry with you.", opts: ["had better not","would better not","should have not"], a: 0, ex: "'Had better not' warns someone not to do something.", exId: "'Had better not' memperingatkan agar tidak melakukan sesuatu." },
    { q: "The train leaves in five minutes. You ___ run if you want to catch it.", opts: ["had better","must have","could have"], a: 0, ex: "'Had better' gives a strong warning about now/future.", exId: "'Had better' memberi peringatan kuat untuk sekarang/nanti." },
    { q: "You ___ smoke inside the airport. It is against the law.", opts: ["mustn't","don't have to","needn't"], a: 0, ex: "'Mustn't' = it is prohibited.", exId: "'Mustn't' = dilarang." },
    { q: "Tomorrow is a public holiday, so you ___ come to the office.", opts: ["mustn't","don't have to","had better not"], a: 1, ex: "'Don't have to' = it is not necessary.", exId: "'Don't have to' = tidak wajib / tidak perlu." },
    { q: "Passengers ___ use their phones during take-off. It is dangerous.", opts: ["don't have to","don't need to","mustn't"], a: 2, ex: "'Mustn't' = it is prohibited.", exId: "'Mustn't' = dilarang." },
    { q: "The app is completely free, so you ___ pay anything to use it.", opts: ["mustn't","don't have to","had better not"], a: 1, ex: "'Don't have to' = it is not necessary.", exId: "'Don't have to' = tidak wajib / tidak perlu." },
    { q: "You ___ press that red button. It will stop all the machines in the factory.", opts: ["mustn't","don't have to","needn't"], a: 0, ex: "'Mustn't' = it is prohibited.", exId: "'Mustn't' = dilarang." },
    { q: "When the new bridge is finished, drivers ___ cross the river in five minutes.", opts: ["can","will be able to","could"], a: 1, ex: "For future ability use 'will be able to', not 'can'.", exId: "Untuk kemampuan di masa depan pakai 'will be able to', bukan 'can'." },
    { q: "Where is Tom? He ___ be in the meeting room, but I'm not sure.", opts: ["might","will","must"], a: 0, ex: "Use 'might/may/could' for something uncertain.", exId: "Gunakan 'might/may/could' untuk sesuatu yang belum pasti." },
    { q: "How did the vase break? The cat ___ knocked it over, but nobody saw it.", opts: ["could have","must have","can't have"], a: 0, ex: "'Could have + V3' = it possibly happened.", exId: "'Could have + V3' = mungkin terjadi." },
    { q: "The battery is dead. You ___ charge the phone before the long trip.", opts: ["might","could","need to"], a: 2, ex: "Use 'need to' to show something is necessary.", exId: "Gunakan 'need to' untuk menunjukkan sesuatu perlu dilakukan." },
    { q: "If your tooth hurts, you ___ see a dentist very soon.", opts: ["must have","could have","ought to"], a: 2, ex: "'Ought to' gives advice, like 'should'.", exId: "'Ought to' memberi saran, sama seperti 'should'." },
    { q: "The lights are on in their house. They ___ come home already.", opts: ["can't have","shouldn't have","must have"], a: 2, ex: "'Must have + V3' = you are sure it happened.", exId: "'Must have + V3' = yakin sesuatu sudah terjadi." },
    { q: "She says she saw the film, but it only opens tomorrow. She ___ seen it.", opts: ["must have","can't have","should have"], a: 1, ex: "'Can't have + V3' = you are sure it did not happen.", exId: "'Can't have + V3' = yakin sesuatu tidak terjadi." },
    { q: "There were no taxis at all, so we ___ walk all the way to the hotel.", opts: ["must","had to","have to"], a: 1, ex: "Use 'had to' for obligation in the past.", exId: "Gunakan 'had to' untuk kewajiban di masa lalu." },
    { q: "The hotel price includes breakfast, so we ___ buy food in the morning.", opts: ["mustn't","had better not","don't have to"], a: 2, ex: "'Don't have to' = it is not necessary.", exId: "'Don't have to' = tidak wajib / tidak perlu." },
    { q: "Which sentence is correct?", opts: ["When I was a child, I could ride a bike.","When I was a child, I can ride a bike.","When I was a child, I will be able to ride a bike."], a: 0, ex: "Use 'could' for past ability, not 'can' or 'will be able to'.", exId: "Untuk kemampuan masa lalu pakai 'could', bukan 'can' atau 'will be able to'." },
    { q: "Which sentence is correct?", opts: ["He must finished already; he started one minute ago.","He can't have finished already; he started one minute ago.","He can't finished already; he started one minute ago."], a: 1, ex: "'Can't have + V3' needs the past participle 'finished'.", exId: "'Can't have + V3' memakai bentuk ketiga (V3)." },
    { q: "Which sentence is correct?", opts: ["You mustn't drive without a licence.","You don't have to drive without a licence.","You had better not to drive without a licence."], a: 0, ex: "'Mustn't' shows prohibition; never use 'to' after 'had better'.", exId: "'Mustn't' = dilarang; jangan pakai 'to' setelah 'had better'." },
    { q: "Which sentence is correct?", opts: ["I should called you yesterday, but I forgot.","I must have call you yesterday, but I forgot.","I should have called you yesterday, but I forgot."], a: 2, ex: "'Should have + V3' = past regret; keep the V3 form.", exId: "'Should have + V3' = penyesalan masa lalu; pakai bentuk V3." },
    { q: "Which sentence is correct?", opts: ["Next year I will be able to speak three languages.","Next year I can speak three languages.","Next year I could speak three languages."], a: 0, ex: "Use 'will be able to' for future ability, not 'can/could'.", exId: "Untuk kemampuan masa depan pakai 'will be able to', bukan 'can/could'." },
    { q: "Which sentence is correct?", opts: ["We must to pay in cash because the card machine was broken.","We had to pay in cash because the card machine was broken.","We had better paid in cash because the card machine was broken."], a: 1, ex: "Past obligation is 'had to' + base verb.", exId: "Kewajiban masa lalu memakai 'had to' + kata kerja dasar." },
    { q: "By next summer, I ___ swim across the lake.", opts: ["can","could","will be able to"], a: 2, ex: "Use 'will be able to' for future ability, not 'can'.", exId: "Pakai 'will be able to' untuk kemampuan di masa depan, bukan 'can'." },
    { q: "When I was a child, I ___ climb trees very easily.", opts: ["could","can","must"], a: 0, ex: "Use 'could' for general ability in the past.", exId: "Pakai 'could' untuk kemampuan umum di masa lalu." },
    { q: "The exit was blocked, but everyone ___ get out safely.", opts: ["could","was able to","can"], a: 1, ex: "For one specific past success, use 'was able to', not 'could'.", exId: "Untuk satu keberhasilan spesifik di masa lalu, pakai 'was able to', bukan 'could'." },
    { q: "These days she ___ play the piano beautifully.", opts: ["could","must have","can"], a: 2, ex: "Use 'can' for present ability.", exId: "Pakai 'can' untuk kemampuan saat ini." },
    { q: "I ___ sleep last night because the street was too noisy.", opts: ["couldn't","can't","mustn't"], a: 0, ex: "Use 'couldn't' for lack of ability in the past.", exId: "Pakai 'couldn't' untuk ketidakmampuan di masa lalu." },
    { q: "He is very strong; he ___ carry that heavy box alone.", opts: ["must","could have","can"], a: 2, ex: "Use 'can' for present ability.", exId: "Pakai 'can' untuk kemampuan saat ini." },
    { q: "Which sentence is correct?", opts: ["Yesterday I was able to finish all the work.","Yesterday I can finish all the work.","Yesterday I could finish all the work."], a: 0, ex: "For a specific past success, use 'was able to'.", exId: "Untuk keberhasilan spesifik di masa lalu, pakai 'was able to'." },
    { q: "Dogs ___ hear sounds that people cannot.", opts: ["must","can","should"], a: 1, ex: "Use 'can' for general ability.", exId: "Pakai 'can' untuk kemampuan umum." },
    { q: "The box was too heavy, so I ___ lift it by myself.", opts: ["can't","mustn't","couldn't"], a: 2, ex: "Use 'couldn't' for inability in the past.", exId: "Pakai 'couldn't' untuk ketidakmampuan di masa lalu." },
    { q: "The sky is completely clear, so it ___ stay sunny all day.", opts: ["might","will","could"], a: 1, ex: "Use 'will' when you are certain about the future.", exId: "Pakai 'will' saat kamu yakin/pasti tentang masa depan." },
    { q: "Where are my keys? They ___ be in the car, but I'm not sure.", opts: ["could","must","will"], a: 0, ex: "Use 'could' for an uncertain possibility.", exId: "Pakai 'could' untuk kemungkinan yang belum pasti." },
    { q: "Don't call him now. He ___ be at work; he always works at this hour.", opts: ["might","will","could"], a: 1, ex: "Use 'will' for near certainty based on a habit.", exId: "Pakai 'will' untuk hampir pasti berdasarkan kebiasaan." },
    { q: "The train ___ be late; there is often traffic on this line.", opts: ["won't","must","may"], a: 2, ex: "Use 'may' for a possibility.", exId: "Pakai 'may' untuk kemungkinan." },
    { q: "Which sentence is correct?", opts: ["It might rain tonight.","It will maybe rain tonight.","It must rain tonight maybe."], a: 0, ex: "Use 'might' + base verb for possibility.", exId: "Pakai 'might' + kata kerja dasar untuk kemungkinan." },
    { q: "Be careful with that dog. It ___ bite strangers.", opts: ["will not","may","must"], a: 1, ex: "Use 'may' for a possibility.", exId: "Pakai 'may' untuk kemungkinan." },
    { q: "Call her first. She ___ be at home right now.", opts: ["can't","mustn't","might not"], a: 2, ex: "Use 'might not' for an uncertain negative possibility.", exId: "Pakai 'might not' untuk kemungkinan negatif yang belum pasti." },
    { q: "I really ___ call my mum tonight; I promised her.", opts: ["might","must","could"], a: 1, ex: "Use 'must' for a strong personal obligation.", exId: "Pakai 'must' untuk kewajiban pribadi yang kuat." },
    { q: "Yesterday the lift was broken, so we ___ use the stairs.", opts: ["must","have to","had to"], a: 2, ex: "Use 'had to' for a past obligation.", exId: "Pakai 'had to' untuk kewajiban di masa lalu." },
    { q: "The plants look very dry. You ___ water them today.", opts: ["need to","might","could"], a: 0, ex: "Use 'need to' for necessity.", exId: "Pakai 'need to' untuk keperluan/kebutuhan." },
    { q: "This is a hospital. You ___ make loud noise here.", opts: ["don't have to","don't need to","mustn't"], a: 2, ex: "'mustn't' means it is prohibited.", exId: "'mustn't' berarti dilarang." },
    { q: "The restaurant was full, so we ___ wait for a table.", opts: ["had to","must","have to"], a: 0, ex: "Use 'had to' for a past necessity.", exId: "Pakai 'had to' untuk keharusan di masa lalu." },
    { q: "You ___ touch that pan; it's very hot and dangerous.", opts: ["don't have to","mustn't","needn't"], a: 1, ex: "'mustn't' warns that something is not allowed.", exId: "'mustn't' memperingatkan sesuatu yang tidak boleh." },
    { q: "My sister ___ wear glasses to read small print.", opts: ["has to","have to","must have"], a: 0, ex: "Use 'has to' with he/she/it.", exId: "Pakai 'has to' dengan he/she/it (subjek tunggal orang ketiga)." },
    { q: "The soup was already warm, so I ___ heat it up again.", opts: ["mustn't","didn't have to","couldn't"], a: 1, ex: "'didn't have to' means it was not necessary.", exId: "'didn't have to' berarti tidak perlu (di masa lalu)." },
    { q: "Which sentence is correct?", opts: ["Yesterday I must go to the doctor.","Yesterday I have to go to the doctor.","Yesterday I had to go to the doctor."], a: 2, ex: "'must' has no past form; use 'had to'.", exId: "'must' tidak punya bentuk lampau; pakai 'had to'." },
    { q: "That milk smells bad. You ___ throw it away now.", opts: ["must have","ought to","could have"], a: 1, ex: "'ought to' gives advice, like 'should'.", exId: "'ought to' memberi saran, seperti 'should'." },
    { q: "You ___ drink so much coffee at night; it's bad for your sleep.", opts: ["couldn't have","shouldn't","mustn't have"], a: 1, ex: "Use 'shouldn't' to advise against something.", exId: "Pakai 'shouldn't' untuk menyarankan agar tidak melakukan sesuatu." },
    { q: "You ___ leave now, or you'll miss the last bus.", opts: ["would rather","should have","had better"], a: 2, ex: "'had better' warns of a bad result.", exId: "'had better' memperingatkan akibat buruk." },
    { q: "It's raining hard. We ___ not drive too fast on this road.", opts: ["had better","would rather","must have"], a: 0, ex: "'had better not' warns against a risky action.", exId: "'had better not' memperingatkan agar tidak melakukan hal berisiko." },
    { q: "Which sentence is correct?", opts: ["I should studied more for the exam.","I should have studied more for the exam.","I must have studied more for the exam."], a: 1, ex: "Regret about the past uses 'should have + V3'.", exId: "Penyesalan tentang masa lalu memakai 'should have + V3'." },
    { q: "You're late again. You ___ set an alarm last night.", opts: ["must have","can't have","should have"], a: 2, ex: "'should have + V3' points out a better past choice.", exId: "'should have + V3' menunjukkan pilihan masa lalu yang lebih baik." },
    { q: "You ___ take a coat; it's very cold outside today.", opts: ["had better","would rather","must have"], a: 0, ex: "'had better' gives strong advice with a warning.", exId: "'had better' memberi saran kuat dengan peringatan." },
    { q: "She ___ heard you; she was wearing headphones the whole time.", opts: ["can't have","must have","should have"], a: 0, ex: "'can't have + V3' means you are sure it did not happen.", exId: "'can't have + V3' berarti kamu yakin itu tidak terjadi." },
  ],
  12: [
    { q: "The manager ___ hired me is very kind.", opts: ["who","which","where"], a: 0, ex: "Use 'who' for a person as the subject of the clause.", exId: "Pakai 'who' untuk orang sebagai subjek anak kalimat." },
    { q: "My colleague, ___ sits next to me, speaks three languages.", opts: ["that","who","which"], a: 1, ex: "Non-defining clauses (with commas) use 'who', never 'that'.", exId: "Anak kalimat non-defining (pakai koma) pakai 'who', bukan 'that'." },
    { q: "The student ___ answered the question got a prize.", opts: ["which","who","whose"], a: 1, ex: "Use 'who' for a person, not 'which' or 'whose'.", exId: "Pakai 'who' untuk orang, bukan 'which' atau 'whose'." },
    { q: "The customer ___ complained wants a refund.", opts: ["where","when","who"], a: 2, ex: "Use 'who' for people; 'where' and 'when' are for place and time.", exId: "Pakai 'who' untuk orang; 'where'/'when' untuk tempat dan waktu." },
    { q: "The passengers ___ missed the train were angry.", opts: ["who","which","where"], a: 0, ex: "Use 'who' for people, not 'which'.", exId: "Pakai 'who' untuk orang, bukan 'which'." },
    { q: "The doctor ___ examined me was very patient.", opts: ["which","whose","who"], a: 2, ex: "Use 'who' for a person as subject of the clause.", exId: "Pakai 'who' untuk orang sebagai subjek anak kalimat." },
    { q: "The actor ___ starred in that film is now famous.", opts: ["whom","who","which"], a: 1, ex: "As subject use 'who', not 'whom'; 'which' is for things.", exId: "Sebagai subjek pakai 'who', bukan 'whom'; 'which' untuk benda." },
    { q: "The people ___ live upstairs are very noisy.", opts: ["which","who","where"], a: 1, ex: "Use 'who' for people as the subject.", exId: "Pakai 'who' untuk orang sebagai subjek." },
    { q: "My teacher, ___ retired last year, still visits us.", opts: ["which","who","that"], a: 1, ex: "Non-defining clause about a person uses 'who', never 'that'.", exId: "Anak kalimat non-defining tentang orang pakai 'who', bukan 'that'." },
    { q: "The engineer ___ fixed the server saved the company.", opts: ["whose","who","where"], a: 1, ex: "Use 'who' for a person; 'whose' shows possession.", exId: "Pakai 'who' untuk orang; 'whose' untuk kepemilikan." },
    { q: "The bus ___ goes to the city centre is number 7.", opts: ["who","which","where"], a: 1, ex: "Use 'which' for a thing as subject; 'who' is for people.", exId: "Pakai 'which' untuk benda sebagai subjek; 'who' untuk orang." },
    { q: "My phone, ___ I bought last month, already has a problem.", opts: ["which","that","who"], a: 0, ex: "Non-defining clause about a thing uses 'which', never 'that'.", exId: "Anak kalimat non-defining tentang benda pakai 'which', bukan 'that'." },
    { q: "The train ___ leaves at noon is always full.", opts: ["which","who","when"], a: 0, ex: "Use 'which' for a thing; 'who' is for people, 'when' for time.", exId: "Pakai 'which' untuk benda; 'who' untuk orang, 'when' untuk waktu." },
    { q: "She showed me the photos, ___ were taken in Bali.", opts: ["who","that","which"], a: 2, ex: "Non-defining clause with commas uses 'which', not 'that'.", exId: "Anak kalimat non-defining berkoma pakai 'which', bukan 'that'." },
    { q: "The app ___ tracks my spending is free.", opts: ["who","which","whose"], a: 1, ex: "Use 'which' for a thing as the subject.", exId: "Pakai 'which' untuk benda sebagai subjek." },
    { q: "The car ___ he drives is very old.", opts: ["where","which","who"], a: 1, ex: "Use 'which' for a thing as object; 'where' is for place.", exId: "Pakai 'which' untuk benda sebagai objek; 'where' untuk tempat." },
    { q: "This is the laptop ___ I use for work.", opts: ["who","when","which"], a: 2, ex: "Use 'which' for a thing, not 'who' or 'when'.", exId: "Pakai 'which' untuk benda, bukan 'who' atau 'when'." },
    { q: "The email, ___ arrived this morning, was from my boss.", opts: ["that","which","who"], a: 1, ex: "Non-defining clause about a thing uses 'which', never 'that'.", exId: "Anak kalimat non-defining tentang benda pakai 'which', bukan 'that'." },
    { q: "The medicine ___ the doctor gave me works well.", opts: ["which","who","where"], a: 0, ex: "Use 'which' for a thing as the object of the clause.", exId: "Pakai 'which' untuk benda sebagai objek anak kalimat." },
    { q: "The man ___ car was stolen went to the police.", opts: ["who","whose","which"], a: 1, ex: "Use 'whose' to show possession (the man's car).", exId: "Pakai 'whose' untuk kepemilikan (mobil milik pria itu)." },
    { q: "I have a friend ___ father is a pilot.", opts: ["whose","who","which"], a: 0, ex: "Use 'whose' to show possession (my friend's father).", exId: "Pakai 'whose' untuk kepemilikan (ayah milik teman saya)." },
    { q: "The company ___ products we use is based in Japan.", opts: ["which","whose","that"], a: 1, ex: "Use 'whose' for possession, even with things.", exId: "Pakai 'whose' untuk kepemilikan, termasuk untuk benda." },
    { q: "She is the writer ___ books sell millions.", opts: ["who","whose","where"], a: 1, ex: "Use 'whose' to show possession (the writer's books).", exId: "Pakai 'whose' untuk kepemilikan (buku milik penulis itu)." },
    { q: "The hotel ___ rooms were dirty gave us a refund.", opts: ["whose","which","where"], a: 0, ex: "Use 'whose' before a possessed noun, even for things.", exId: "Pakai 'whose' sebelum benda yang dimiliki, termasuk benda." },
    { q: "My neighbour, ___ dog barks all night, apologised.", opts: ["who","whose","that"], a: 1, ex: "Use 'whose' for possession (the neighbour's dog).", exId: "Pakai 'whose' untuk kepemilikan (anjing milik tetangga)." },
    { q: "The students ___ projects were the best received awards.", opts: ["whose","who","which"], a: 0, ex: "Use 'whose' to show possession (the students' projects).", exId: "Pakai 'whose' untuk kepemilikan (proyek milik para siswa)." },
    { q: "He is a musician ___ songs are known worldwide.", opts: ["which","whose","who"], a: 1, ex: "Use 'whose' to show possession (the musician's songs).", exId: "Pakai 'whose' untuk kepemilikan (lagu milik musisi itu)." },
    { q: "This is the office ___ I work every day.", opts: ["which","where","who"], a: 1, ex: "Use 'where' for a place where an action happens.", exId: "Pakai 'where' untuk tempat terjadinya suatu kegiatan." },
    { q: "That's the restaurant ___ we had dinner last night.", opts: ["where","which","when"], a: 0, ex: "Use 'where' for a place (we had dinner at the restaurant).", exId: "Pakai 'where' untuk tempat (kami makan malam di restoran itu)." },
    { q: "Do you remember the hotel ___ we stayed last summer?", opts: ["which","who","where"], a: 2, ex: "Use 'where' for a place (we stayed at the hotel).", exId: "Pakai 'where' untuk tempat (kami menginap di hotel itu)." },
    { q: "The shop ___ I bought my phone has closed.", opts: ["where","which","when"], a: 0, ex: "Use 'where' for a place (I bought it at the shop).", exId: "Pakai 'where' untuk tempat (saya membelinya di toko itu)." },
    { q: "She comes from a small town ___ everyone knows each other.", opts: ["which","where","who"], a: 1, ex: "Use 'where' for a place where something happens.", exId: "Pakai 'where' untuk tempat terjadinya sesuatu." },
    { q: "The country ___ she grew up is very cold.", opts: ["when","where","which"], a: 1, ex: "Use 'where' for a place (she grew up in the country).", exId: "Pakai 'where' untuk tempat (dia tumbuh di negara itu)." },
    { q: "This is the park ___ we play football on weekends.", opts: ["which","who","where"], a: 2, ex: "Use 'where' for a place (we play at the park).", exId: "Pakai 'where' untuk tempat (kami bermain di taman itu)." },
    { q: "The airport ___ we landed was very crowded.", opts: ["where","when","which"], a: 0, ex: "Use 'where' for a place (we landed at the airport).", exId: "Pakai 'where' untuk tempat (kami mendarat di bandara itu)." },
    { q: "I still remember the day ___ we first met.", opts: ["where","when","which"], a: 1, ex: "Use 'when' for a time (a day).", exId: "Pakai 'when' untuk waktu (sebuah hari)." },
    { q: "Monday is the day ___ the shop opens late.", opts: ["when","who","where"], a: 0, ex: "Use 'when' for a time (a day).", exId: "Pakai 'when' untuk waktu (sebuah hari)." },
    { q: "That was the year ___ I started university.", opts: ["which","when","where"], a: 1, ex: "Use 'when' for a time (a year).", exId: "Pakai 'when' untuk waktu (sebuah tahun)." },
    { q: "Summer is the season ___ prices go up.", opts: ["when","where","which"], a: 0, ex: "Use 'when' for a time (a season).", exId: "Pakai 'when' untuk waktu (sebuah musim)." },
    { q: "There was a moment ___ everyone went quiet.", opts: ["which","who","when"], a: 2, ex: "Use 'when' for a time (a moment).", exId: "Pakai 'when' untuk waktu (sebuah momen)." },
    { q: "Do you recall the time ___ the power went off?", opts: ["when","where","who"], a: 0, ex: "Use 'when' for a time.", exId: "Pakai 'when' untuk waktu." },
    { q: "9 a.m. is the hour ___ the meeting begins.", opts: ["where","when","which"], a: 1, ex: "Use 'when' for a time (an hour).", exId: "Pakai 'when' untuk waktu (sebuah jam)." },
    { q: "It's the best film ___ I have ever watched.", opts: ["that","who","where"], a: 0, ex: "After a superlative, use 'that' in the defining clause.", exId: "Setelah superlatif, pakai 'that' di anak kalimat defining." },
    { q: "Everything ___ he told me turned out to be false.", opts: ["who","that","where"], a: 1, ex: "After 'everything', use 'that'.", exId: "Setelah 'everything', pakai 'that'." },
    { q: "This is the only bus ___ stops here.", opts: ["that","who","when"], a: 0, ex: "After 'the only', use 'that' in the defining clause.", exId: "Setelah 'the only', pakai 'that' di anak kalimat defining." },
    { q: "The keys ___ open this door are missing.", opts: ["who","that","where"], a: 1, ex: "Use 'that' for a thing in a defining clause.", exId: "Pakai 'that' untuk benda di anak kalimat defining." },
    { q: "She said something ___ made me laugh.", opts: ["that","who","where"], a: 0, ex: "After 'something', use 'that'.", exId: "Setelah 'something', pakai 'that'." },
    { q: "There is nothing ___ we can do now.", opts: ["who","when","that"], a: 2, ex: "After 'nothing', use 'that'.", exId: "Setelah 'nothing', pakai 'that'." },
    { q: "He bought the same phone ___ I have.", opts: ["that","who","where"], a: 0, ex: "After 'the same', use 'that' for a thing.", exId: "Setelah 'the same', pakai 'that' untuk benda." },
    { q: "Which sentence is correct?", opts: ["My father, that works at a bank, is always busy.","My father, who works at a bank, is always busy.","My father who works at a bank, is always busy."], a: 1, ex: "Non-defining clause needs two commas and 'who', not 'that'.", exId: "Anak kalimat non-defining butuh dua koma dan 'who', bukan 'that'." },
    { q: "Which sentence is correct?", opts: ["The book that I bought yesterday was cheap.","The book, that I bought yesterday, was cheap.","The book what I bought yesterday was cheap."], a: 0, ex: "Defining clause takes no commas; 'what' is never a relative pronoun here.", exId: "Anak kalimat defining tanpa koma; 'what' bukan kata ganti relatif." },
    { q: "Which sentence is correct?", opts: ["The film we saw last night was funny.","The film, we saw last night, was funny.","The film who we saw last night was funny."], a: 0, ex: "In defining clauses you may omit the object pronoun; no commas.", exId: "Di anak kalimat defining, kata ganti objek boleh dihilangkan; tanpa koma." },
    { q: "Which sentence is correct?", opts: ["This laptop, that cost a lot, stopped working.","This laptop, which cost a lot, stopped working.","This laptop which cost a lot, stopped working."], a: 1, ex: "Non-defining clause uses 'which' with two commas, never 'that'.", exId: "Anak kalimat non-defining pakai 'which' dengan dua koma, bukan 'that'." },
    { q: "Which sentence is correct?", opts: ["I know a boy who's bike is red.","I know a boy whose bike is red.","I know a boy which bike is red."], a: 1, ex: "'Whose' shows possession; 'who's' means 'who is'.", exId: "'Whose' menunjukkan kepemilikan; 'who's' berarti 'who is'." },
    { q: "Which sentence is correct?", opts: ["This is the cafe which we met for coffee.","This is the cafe where we met for coffee.","This is the cafe when we met for coffee."], a: 1, ex: "Use 'where' for a place; 'which'/'when' are wrong here.", exId: "Pakai 'where' untuk tempat; 'which'/'when' salah di sini." },
    { q: "My aunt, ___ lives in London, sent me a nice gift.", opts: ["who","which","that"], a: 0, ex: "In clauses with commas, use 'who' for people, never 'that'.", exId: "Di klausa dengan koma, pakai 'who' untuk orang, jangan 'that'." },
    { q: "The doctor ___ helped me at the clinic was very kind.", opts: ["which","who","where"], a: 1, ex: "Use 'who' for people, not 'which' or 'where'.", exId: "Pakai 'who' untuk orang, bukan 'which' atau 'where'." },
    { q: "The players ___ scored the goals are quite young.", opts: ["which","when","who"], a: 2, ex: "Use 'who' for people as the subject.", exId: "Pakai 'who' untuk orang sebagai subjek." },
    { q: "Mr Brown, ___ teaches us music, is retiring soon.", opts: ["who","that","which"], a: 0, ex: "Non-defining clauses use 'who' for people, never 'that'.", exId: "Klausa non-defining pakai 'who' untuk orang, jangan 'that'." },
    { q: "Do you know the man ___ fixed our car yesterday?", opts: ["which","who","whose"], a: 1, ex: "Use 'who' for people, not 'which' or 'whose'.", exId: "Pakai 'who' untuk orang, bukan 'which' atau 'whose'." },
    { q: "She is the nurse ___ looked after my father in hospital.", opts: ["which","where","who"], a: 2, ex: "Use 'who' for the person doing the action.", exId: "Pakai 'who' untuk orang yang melakukan tindakan." },
    { q: "My neighbours, ___ have three dogs, are very friendly.", opts: ["who","that","which"], a: 0, ex: "Use 'who' for people; commas mean 'that' is wrong.", exId: "Pakai 'who' untuk orang; ada koma berarti 'that' salah." },
    { q: "The children ___ play in this park make a lot of noise.", opts: ["which","who","when"], a: 1, ex: "Use 'who' for people, not 'which' or 'when'.", exId: "Pakai 'who' untuk orang, bukan 'which' atau 'when'." },
    { q: "The chef ___ made this soup is quite famous.", opts: ["which","when","who"], a: 2, ex: "Use 'who' for a person, here the chef.", exId: "Pakai 'who' untuk orang, di sini si koki." },
    { q: "This cake, ___ I baked yesterday, is for you.", opts: ["who","which","that"], a: 1, ex: "In clauses with commas, use 'which' for things, never 'that'.", exId: "Di klausa dengan koma, pakai 'which' untuk benda, jangan 'that'." },
    { q: "I bought a jacket ___ keeps me warm in winter.", opts: ["who","where","which"], a: 2, ex: "Use 'which' for things as the subject.", exId: "Pakai 'which' untuk benda sebagai subjek." },
    { q: "The Nile, ___ flows through Egypt, is very long.", opts: ["which","that","who"], a: 0, ex: "Non-defining clauses use 'which' for things, never 'that'.", exId: "Klausa non-defining pakai 'which' untuk benda, jangan 'that'." },
    { q: "The train ___ goes to Rome leaves at noon.", opts: ["who","which","when"], a: 1, ex: "Use 'which' for things, not people or time.", exId: "Pakai 'which' untuk benda, bukan orang atau waktu." },
    { q: "Here is the book ___ helped me pass the exam.", opts: ["who","whose","which"], a: 2, ex: "Use 'which' for a thing, here the book.", exId: "Pakai 'which' untuk benda, di sini buku." },
    { q: "The soup ___ she cooked last night was too salty.", opts: ["which","who","when"], a: 0, ex: "Use 'which' for things as the object.", exId: "Pakai 'which' untuk benda sebagai objek." },
    { q: "My laptop, ___ is quite new, suddenly stopped working.", opts: ["that","which","who"], a: 1, ex: "Use 'which' for things; commas mean 'that' is wrong.", exId: "Pakai 'which' untuk benda; ada koma berarti 'that' salah." },
    { q: "The phone ___ I really want is too expensive.", opts: ["who","where","which"], a: 2, ex: "Use 'which' for things, not people or place.", exId: "Pakai 'which' untuk benda, bukan orang atau tempat." },
    { q: "The only thing ___ matters is your health.", opts: ["where","who","that"], a: 2, ex: "After 'the only thing', use 'that'.", exId: "Setelah 'the only thing', pakai 'that'." },
    { q: "The people and dogs ___ live here are very friendly.", opts: ["that","who","which"], a: 0, ex: "For people and animals together, use 'that'.", exId: "Untuk orang dan hewan bersama, pakai 'that'." },
    { q: "Is there anything ___ I can do to help?", opts: ["when","that","who"], a: 1, ex: "After 'anything', use 'that'.", exId: "Setelah 'anything', pakai 'that'." },
    { q: "That is all ___ I know about the accident.", opts: ["who","where","that"], a: 2, ex: "After 'all', use 'that'.", exId: "Setelah 'all', pakai 'that'." },
    { q: "Show me the shoes ___ you bought at the market.", opts: ["that","who","when"], a: 0, ex: "In defining clauses, 'that' works for things.", exId: "Di klausa defining, 'that' bisa untuk benda." },
    { q: "He is the fastest runner ___ our school has ever had.", opts: ["which","that","where"], a: 1, ex: "After a superlative, use 'that', not 'which' or 'where'.", exId: "Setelah superlatif, pakai 'that', bukan 'which' atau 'where'." },
    { q: "That is the boy ___ bike was stolen last week.", opts: ["whose","who","where"], a: 0, ex: "Use 'whose' for possession, not 'who' or 'where'.", exId: "Pakai 'whose' untuk kepemilikan, bukan 'who' atau 'where'." },
    { q: "We met a couple ___ house is right by the sea.", opts: ["which","whose","when"], a: 1, ex: "Use 'whose' to show something belongs to someone.", exId: "Pakai 'whose' untuk menunjukkan milik seseorang." },
    { q: "The girl ___ phone rang loudly left the room.", opts: ["which","who","whose"], a: 2, ex: "Use 'whose' for possession (the girl's phone).", exId: "Pakai 'whose' untuk kepemilikan (telepon si gadis)." },
    { q: "My uncle, ___ garden is huge, grows his own vegetables.", opts: ["whose","who","which"], a: 0, ex: "Use 'whose' for possession, even with commas.", exId: "Pakai 'whose' untuk kepemilikan, meski ada koma." },
    { q: "She is the woman ___ dog barks all night.", opts: ["which","whose","where"], a: 1, ex: "Use 'whose' for possession, not 'which' or 'where'.", exId: "Pakai 'whose' untuk kepemilikan, bukan 'which' atau 'where'." },
    { q: "This is the writer ___ books I really love.", opts: ["who","when","whose"], a: 2, ex: "Use 'whose' to show the books belong to the writer.", exId: "Pakai 'whose' untuk menunjukkan buku milik penulis." },
    { q: "I know a man ___ son plays for the city team.", opts: ["whose","which","who"], a: 0, ex: "Use 'whose' for possession (the man's son).", exId: "Pakai 'whose' untuk kepemilikan (anak si pria)." },
    { q: "This is the house ___ I grew up.", opts: ["which","where","when"], a: 1, ex: "Use 'where' for a place; no preposition needed.", exId: "Pakai 'where' untuk tempat; tanpa preposisi." },
    { q: "That's the little café ___ we first met.", opts: ["who","which","where"], a: 2, ex: "Use 'where' for a place, not 'who' or 'which'.", exId: "Pakai 'where' untuk tempat, bukan 'who' atau 'which'." },
    { q: "The city ___ she lives is very cold in winter.", opts: ["where","who","when"], a: 0, ex: "Use 'where' for the place where she lives.", exId: "Pakai 'where' untuk tempat dia tinggal." },
  ],
  13: [
    { q: "___ it was raining heavily, we stayed at home all afternoon.", opts: ["Because","Despite","So that"], a: 0, ex: "Use 'because' + clause (subject + verb) to give a reason.", exId: "Gunakan 'because' + klausa (subjek + verba) untuk menyatakan alasan." },
    { q: "The flight was delayed ___ the bad weather.", opts: ["because of","because","although"], a: 0, ex: "'Because of' + noun; 'because' needs a full clause.", exId: "'Because of' + kata benda; 'because' butuh klausa lengkap." },
    { q: "___ you already know the answer, please tell the class.", opts: ["Since","During","Until"], a: 0, ex: "'Since' can mean 'because' before a clause giving a reason.", exId: "'Since' bisa berarti 'because' sebelum klausa yang memberi alasan." },
    { q: "The meeting was cancelled ___ a lack of interest.", opts: ["due to","because","so"], a: 0, ex: "'Due to' + noun phrase gives the cause.", exId: "'Due to' + frasa kata benda menyatakan penyebab." },
    { q: "___ she was the oldest, she looked after the children.", opts: ["As","Despite","In order to"], a: 0, ex: "'As' + clause can give a reason, like 'because'.", exId: "'As' + klausa bisa memberi alasan, seperti 'because'." },
    { q: "Many shops closed ___ the economic crisis.", opts: ["as a result of","as a result","because"], a: 0, ex: "'As a result of' + noun; 'as a result' stands alone.", exId: "'As a result of' + kata benda; 'as a result' berdiri sendiri." },
    { q: "The bus was full, ___ we waited for the next one.", opts: ["so","because","although"], a: 0, ex: "'So' introduces a result or effect of the first clause.", exId: "'So' memperkenalkan hasil atau akibat dari klausa pertama." },
    { q: "I lost my phone, ___ I couldn't call anyone.", opts: ["so","because of","despite"], a: 0, ex: "'So' joins a cause to its effect between two clauses.", exId: "'So' menghubungkan sebab dengan akibatnya di antara dua klausa." },
    { q: "___ the price was high, she decided to buy the laptop.", opts: ["Although","Because","So that"], a: 0, ex: "'Although' + clause shows contrast with the main idea.", exId: "'Although' + klausa menunjukkan kontras dengan gagasan utama." },
    { q: "He went to work ___ he felt sick.", opts: ["even though","because of","in order to"], a: 0, ex: "'Even though' + clause is a strong contrast conjunction.", exId: "'Even though' + klausa adalah konjungsi kontras yang kuat." },
    { q: "The car is old, ___ it still runs well.", opts: ["though","because","so that"], a: 0, ex: "'Though' can show contrast, similar to 'although'.", exId: "'Though' bisa menunjukkan kontras, mirip 'although'." },
    { q: "___ the heavy traffic, we arrived on time.", opts: ["Despite","Although","Because"], a: 0, ex: "'Despite' + noun shows contrast; 'although' needs a clause.", exId: "'Despite' + kata benda menunjukkan kontras; 'although' butuh klausa." },
    { q: "They finished the project ___ many problems.", opts: ["in spite of","although","even though"], a: 0, ex: "'In spite of' + noun; 'although'/'even though' need clauses.", exId: "'In spite of' + kata benda; 'although'/'even though' butuh klausa." },
    { q: "___ feeling tired, she kept studying for the exam.", opts: ["Despite","Although","Because"], a: 0, ex: "'Despite' can be followed by an -ing form (a gerund).", exId: "'Despite' bisa diikuti bentuk -ing (gerund)." },
    { q: "Some people like coffee, ___ others prefer tea.", opts: ["while","because","so that"], a: 0, ex: "'While' can contrast two different facts or ideas.", exId: "'While' bisa mengontraskan dua fakta atau gagasan berbeda." },
    { q: "She spoke slowly ___ everyone could understand her.", opts: ["so that","because","despite"], a: 0, ex: "'So that' + clause (with a modal) shows purpose.", exId: "'So that' + klausa (dengan modal) menunjukkan tujuan." },
    { q: "He took a taxi ___ get to the airport faster.", opts: ["in order to","so that","because"], a: 0, ex: "'In order to' + base verb expresses purpose.", exId: "'In order to' + verba dasar menyatakan tujuan." },
    { q: "Please turn on the light ___ I can see the keyboard.", opts: ["so that","in order to","although"], a: 0, ex: "'So that' + clause states the purpose of an action.", exId: "'So that' + klausa menyatakan tujuan suatu tindakan." },
    { q: "We saved money ___ buy a new phone.", opts: ["in order to","so that","because of"], a: 0, ex: "Use 'in order to' + verb to give the purpose.", exId: "Gunakan 'in order to' + verba untuk memberi tujuan." },
    { q: "I listened to music ___ I was doing my homework.", opts: ["while","because","so that"], a: 0, ex: "'While' shows two actions happening at the same time.", exId: "'While' menunjukkan dua tindakan terjadi pada waktu bersamaan." },
    { q: "Turn off your computer ___ you leave the office.", opts: ["before","because","although"], a: 0, ex: "'Before' shows one action happens earlier than another.", exId: "'Before' menunjukkan satu tindakan terjadi lebih dulu dari yang lain." },
    { q: "___ we finished dinner, we watched a movie together.", opts: ["After","Because of","So that"], a: 0, ex: "'After' + clause shows the later of two actions.", exId: "'After' + klausa menunjukkan tindakan yang terjadi kemudian." },
    { q: "Please wait here ___ the manager comes back.", opts: ["until","because","despite"], a: 0, ex: "'Until' shows an action continues up to a point in time.", exId: "'Until' menunjukkan tindakan berlanjut sampai suatu titik waktu." },
    { q: "___ the payment is confirmed, we will send your order.", opts: ["Once","Because of","In order to"], a: 0, ex: "'Once' means 'as soon as' something happens.", exId: "'Once' berarti 'segera setelah' sesuatu terjadi." },
    { q: "Call me ___ you get home from work tonight.", opts: ["as soon as","because","so that"], a: 0, ex: "'As soon as' means immediately after something happens.", exId: "'As soon as' berarti segera setelah sesuatu terjadi." },
    { q: "We took an umbrella ___ the sky looked grey.", opts: ["so that","because","despite"], a: 1, ex: "'Because' + clause explains the reason for an action.", exId: "'Because' + klausa menjelaskan alasan suatu tindakan." },
    { q: "The road was closed ___ a bad accident.", opts: ["because","although","because of"], a: 2, ex: "'Because of' + noun; 'because' needs a subject and verb.", exId: "'Because of' + kata benda; 'because' butuh subjek dan verba." },
    { q: "___ the food was cheap, it tasted delicious.", opts: ["Because","Although","So that"], a: 1, ex: "'Although' introduces a surprising contrast.", exId: "'Although' memperkenalkan kontras yang mengejutkan." },
    { q: "___ his low salary, he manages to save money.", opts: ["Because","So that","Despite"], a: 2, ex: "'Despite' + noun phrase shows an unexpected contrast.", exId: "'Despite' + frasa kata benda menunjukkan kontras tak terduga." },
    { q: "It was getting dark, ___ we turned on the lights.", opts: ["because","so","although"], a: 1, ex: "'So' shows the result of the situation before it.", exId: "'So' menunjukkan hasil dari situasi sebelumnya." },
    { q: "I was reading a book ___ the phone suddenly rang.", opts: ["so that","because","when"], a: 2, ex: "'When' marks the moment another action happened.", exId: "'When' menandai saat tindakan lain terjadi." },
    { q: "My brother is very tidy, ___ I am quite messy.", opts: ["while","because","until"], a: 0, ex: "'While' contrasts two opposite facts about people.", exId: "'While' mengontraskan dua fakta yang berlawanan tentang orang." },
    { q: "I wrote down the address ___ I would not forget it.", opts: ["because","in order to","so that"], a: 2, ex: "'So that' + clause with 'would/could' shows purpose.", exId: "'So that' + klausa dengan 'would/could' menunjukkan tujuan." },
    { q: "She studies every night ___ pass the final exam.", opts: ["in order to","so that","because"], a: 0, ex: "'In order to' + verb explains why an action is done.", exId: "'In order to' + verba menjelaskan mengapa tindakan dilakukan." },
    { q: "Always save your work ___ you close the program.", opts: ["because","before","so that"], a: 1, ex: "'Before' shows saving must happen earlier than closing.", exId: "'Before' menunjukkan menyimpan harus terjadi sebelum menutup." },
    { q: "___ the shop closes, the staff clean the floors.", opts: ["After","Because of","Despite"], a: 0, ex: "'After' + clause shows the cleaning happens later.", exId: "'After' + klausa menunjukkan pembersihan terjadi kemudian." },
    { q: "The children played outside ___ it got too cold.", opts: ["until","because","so that"], a: 0, ex: "'Until' shows the action stopped at that point in time.", exId: "'Until' menunjukkan tindakan berhenti pada titik waktu itu." },
    { q: "You can download the app ___ you create an account.", opts: ["despite","so that","once"], a: 2, ex: "'Once' means after something has been done.", exId: "'Once' berarti setelah sesuatu selesai dilakukan." },
    { q: "___ the alarm rang, the workers left the building.", opts: ["As soon as","Because of","So that"], a: 0, ex: "'As soon as' shows one action right after another.", exId: "'As soon as' menunjukkan satu tindakan tepat setelah yang lain." },
    { q: "___ we have no cash, let's pay by card instead.", opts: ["Despite","In order to","Since"], a: 2, ex: "'Since' gives a reason, like 'because', before a clause.", exId: "'Since' memberi alasan, seperti 'because', sebelum klausa." },
    { q: "___ heavy snow, all trains were cancelled today.", opts: ["Due to","Because","Although"], a: 0, ex: "'Due to' + noun; 'because' would need a full clause.", exId: "'Due to' + kata benda; 'because' butuh klausa lengkap." },
    { q: "The phone sold out quickly, ___ it was expensive.", opts: ["because","so that","even though"], a: 2, ex: "'Even though' shows a strong, surprising contrast.", exId: "'Even though' menunjukkan kontras kuat yang mengejutkan." },
    { q: "___ working all day, he still had energy to exercise.", opts: ["In spite of","Although","Because"], a: 0, ex: "'In spite of' + -ing form shows contrast.", exId: "'In spite of' + bentuk -ing menunjukkan kontras." },
    { q: "Someone stole my bag ___ I was buying a ticket.", opts: ["because","so that","while"], a: 2, ex: "'While' shows the theft happened during another action.", exId: "'While' menunjukkan pencurian terjadi selama tindakan lain." },
    { q: "I couldn't buy the shoes ___ I had left my wallet at home.", opts: ["so that","because","despite"], a: 1, ex: "'Because' + clause gives the reason for something.", exId: "'Because' + klausa memberi alasan atas sesuatu." },
    { q: "___ nobody would get lost, the guide gave us a map.", opts: ["So that","In order to","Because of"], a: 0, ex: "'So that' + clause can begin a sentence to show purpose.", exId: "'So that' + klausa bisa mengawali kalimat untuk menunjukkan tujuan." },
    { q: "We left early, ___ the office was far from the station.", opts: ["despite","as","so that"], a: 1, ex: "'As' can give the reason, similar to 'because'.", exId: "'As' bisa memberi alasan, mirip 'because'." },
    { q: "___ the long queue, customers waited to buy the new phone.", opts: ["Despite","Because","When"], a: 0, ex: "'Despite' + noun shows contrast with what people did.", exId: "'Despite' + kata benda menunjukkan kontras dengan tindakan orang." },
    { q: "Which sentence is correct?", opts: ["I was late, the traffic was terrible.","I was late because the traffic was terrible.","Because the traffic was terrible."], a: 1, ex: "Two clauses need a conjunction; a lone comma is a comma splice.", exId: "Dua klausa butuh konjungsi; koma sendiri adalah comma splice." },
    { q: "Which sentence is correct?", opts: ["Although the meeting was long.","Although the meeting was long, we made good decisions.","The meeting was long, we made good decisions."], a: 1, ex: "A dependent clause needs a main clause; alone it is a fragment.", exId: "Klausa dependen butuh klausa utama; sendiri jadi fragmen." },
    { q: "Which sentence is correct?", opts: ["The shop was closed, we came back the next day.","The shop was closed, so we came back the next day.","Because the shop was closed the next day."], a: 1, ex: "Join two clauses with 'so', not just a comma.", exId: "Gabungkan dua klausa dengan 'so', bukan hanya koma." },
    { q: "Which sentence is correct?", opts: ["When the bus arrived, we got on quickly.","When the bus arrived. We got on quickly.","When the bus arrived, it left, we ran."], a: 0, ex: "Keep the time clause and main clause in one sentence.", exId: "Satukan klausa waktu dan klausa utama dalam satu kalimat." },
    { q: "Which sentence is correct?", opts: ["She saved money, she bought a new laptop.","She saved money and bought a new laptop.","And bought a new laptop."], a: 1, ex: "Use 'and' to join clauses; a comma alone splices them.", exId: "Gunakan 'and' untuk menggabung klausa; koma saja menyambung salah." },
    { q: "Which sentence is correct?", opts: ["He stayed home. Because he felt ill.","He stayed home because he felt ill.","He stayed home, he felt ill."], a: 1, ex: "Don't split a 'because' clause off with a full stop.", exId: "Jangan pisahkan klausa 'because' dengan tanda titik." },
    { q: "___ she was hungry, she made a sandwich.", opts: ["Because","Although","So that"], a: 0, ex: "Use 'because' + a clause to give a reason.", exId: "Pakai 'because' + klausa untuk memberi alasan." },
    { q: "We took a taxi ___ the heavy rain.", opts: ["because","because of","although"], a: 1, ex: "'Because of' comes before a noun, not a clause.", exId: "'Because of' diikuti kata benda, bukan klausa." },
    { q: "She was tired, ___ she went to bed early.", opts: ["so","because","although"], a: 0, ex: "'So' links a cause to its result.", exId: "'So' menghubungkan sebab dengan akibatnya." },
    { q: "___ he had studied hard, he passed the exam.", opts: ["Despite","Because","So"], a: 1, ex: "Use 'because' + a clause to give the reason.", exId: "Pakai 'because' + klausa untuk memberi alasan." },
    { q: "The roads were icy ___ the freezing temperatures.", opts: ["so that","because","as a result of"], a: 2, ex: "'As a result of' + noun shows the cause.", exId: "'As a result of' + kata benda menunjukkan penyebab." },
    { q: "I couldn't sleep ___ the noise from the street.", opts: ["because of","because","while"], a: 0, ex: "'Because of' comes before a noun phrase.", exId: "'Because of' diikuti frasa kata benda." },
    { q: "___ we didn't have any eggs, I couldn't bake the cake.", opts: ["Despite","Since","So that"], a: 1, ex: "'Since' can mean 'because' + a clause.", exId: "'Since' bisa berarti 'karena' + klausa." },
    { q: "The shop was closed, ___ we went home.", opts: ["although","because","so"], a: 2, ex: "'So' introduces the result of a cause.", exId: "'So' memperkenalkan akibat dari suatu sebab." },
    { q: "He missed the bus ___ he woke up late.", opts: ["because","because of","despite"], a: 0, ex: "'Because' + a clause gives the reason.", exId: "'Because' + klausa memberi alasan." },
    { q: "___ it was cold, she went for a swim.", opts: ["Because","Although","So that"], a: 1, ex: "'Although' + clause shows contrast.", exId: "'Although' + klausa menunjukkan kontras." },
    { q: "We enjoyed the picnic ___ the rain.", opts: ["although","because","despite"], a: 2, ex: "'Despite' takes a noun, not a clause.", exId: "'Despite' diikuti kata benda, bukan klausa." },
    { q: "___ he is rich, he is not happy.", opts: ["Even though","Because","When"], a: 0, ex: "'Even though' + clause shows strong contrast.", exId: "'Even though' + klausa menunjukkan kontras yang kuat." },
    { q: "___ the long walk, we weren't tired at all.", opts: ["Despite","Although","Because"], a: 0, ex: "'Despite' + noun shows contrast.", exId: "'Despite' + kata benda menunjukkan kontras." },
    { q: "The team played well, ___ they lost the game.", opts: ["so","though","because"], a: 1, ex: "'Though' shows contrast, like 'but'.", exId: "'Though' menunjukkan kontras, mirip 'but'." },
    { q: "___ she had a cold, she still went to work.", opts: ["Despite","Because","Although"], a: 2, ex: "'Although' + clause shows contrast; 'still' signals it.", exId: "'Although' + klausa menunjukkan kontras; 'still' penanda kontras." },
    { q: "He passed the test ___ he hadn't studied much.", opts: ["because of","even though","despite"], a: 1, ex: "'Even though' + clause shows contrast.", exId: "'Even though' + klausa menunjukkan kontras." },
    { q: "I left early ___ I wouldn't miss the train.", opts: ["because","although","so that"], a: 2, ex: "'So that' + clause shows purpose.", exId: "'So that' + klausa menyatakan tujuan." },
    { q: "We whispered ___ we wouldn't wake the baby.", opts: ["in order to","so that","because"], a: 1, ex: "'So that' is used before a clause with a subject.", exId: "'So that' dipakai sebelum klausa yang punya subjek." },
    { q: "He turned down the music ___ study better.", opts: ["so that","despite","in order to"], a: 2, ex: "'In order to' + base verb shows purpose.", exId: "'In order to' + kata kerja dasar menyatakan tujuan." },
    { q: "Take an umbrella ___ you don't get wet.", opts: ["so that","in order to","because of"], a: 0, ex: "'So that' + clause shows purpose.", exId: "'So that' + klausa menyatakan tujuan." },
    { q: "She wrote it down ___ remember it later.", opts: ["so that","in order to","although"], a: 1, ex: "'In order to' + base verb shows purpose.", exId: "'In order to' + kata kerja dasar menyatakan tujuan." },
    { q: "The phone rang ___ I was cooking dinner.", opts: ["after","so that","while"], a: 2, ex: "'While' shows one action during another.", exId: "'While' menunjukkan satu aksi berlangsung saat aksi lain." },
    { q: "You can't watch TV ___ you finish your homework.", opts: ["until","while","because"], a: 0, ex: "'Until' shows the time an action stops.", exId: "'Until' menunjukkan batas waktu berhentinya aksi." },
    { q: "___ the film started, we bought some popcorn.", opts: ["Until","Despite","Before"], a: 2, ex: "'Before' shows the earlier action.", exId: "'Before' menunjukkan aksi yang lebih dulu." },
    { q: "I always brush my teeth ___ I go to bed.", opts: ["before","until","because of"], a: 0, ex: "'Before' shows the earlier action in time.", exId: "'Before' menunjukkan aksi yang terjadi lebih dulu." },
    { q: "She read a book ___ she was waiting for the bus.", opts: ["until","while","so that"], a: 1, ex: "'While' shows two actions at the same time.", exId: "'While' menunjukkan dua aksi pada waktu yang sama." },
    { q: "___ he had finished eating, he washed the dishes.", opts: ["Until","Despite","After"], a: 2, ex: "'After' shows the later action.", exId: "'After' menunjukkan aksi yang terjadi kemudian." },
    { q: "___ she saw the spider, she screamed.", opts: ["Until","As soon as","Because of"], a: 1, ex: "'As soon as' means immediately after.", exId: "'As soon as' berarti segera setelah." },
    { q: "The dog barked ___ it heard the doorbell.", opts: ["until","because of","as soon as"], a: 2, ex: "'As soon as' means right after something happens.", exId: "'As soon as' berarti tepat setelah sesuatu terjadi." },
    { q: "___ I was younger, I played football every day.", opts: ["When","Until","Despite"], a: 0, ex: "'When' introduces a past time period.", exId: "'When' memperkenalkan periode waktu di masa lalu." },
    { q: "Please turn off the lights ___ you leave the room.", opts: ["until","when","because of"], a: 1, ex: "'When' introduces the time of an action.", exId: "'When' memperkenalkan waktu suatu aksi." },
    { q: "___ we had finished lunch, we went for a walk.", opts: ["Until","Although","Once"], a: 2, ex: "'Once' means 'as soon as / after'.", exId: "'Once' berarti 'segera setelah'." },
    { q: "He waited at the station ___ the train came.", opts: ["until","while","despite"], a: 0, ex: "'Until' marks the point when waiting stops.", exId: "'Until' menandai kapan aksi menunggu berhenti." },
    { q: "Which sentence is correct?", opts: ["It was raining, we stayed inside.","Because it was raining, we stayed inside.","Because it was raining."], a: 1, ex: "Two clauses need a conjunction; a lone clause is a fragment.", exId: "Dua klausa butuh konjungsi; klausa sendirian jadi fragment." },
  ],
};

// ---------- UI strings (EN / ID) ----------
const T = {
  en: {
    heroTitle: "Master the rules, reach Band 7",
    heroSub: (n) => `Interactive grammar practice — 13 units and ${n} practice questions.`,
    statsLine: (p, m) => `${p}/13 units practiced · ${m} mastered (80%+)`,
    lastEssay: (b) => ` · last essay ${b}`,
    writingTitle: "Writing Lab",
    writingSub: "Write a Task 2 essay under exam timing, then get an AI band estimate with feedback linked to these units.",
    unitsHeader: "Grammar units",
    unitsHint: "Learn, then practice",
    newLabel: "New",
    footer: "A personal IELTS grammar study app — 13 units of rules and targeted drills. Progress is saved on this device.",
    allUnits: "All units",
    learnTab: "Learn",
    practiceTab: "Practice",
    practiceBtn: "Practice this unit",
    deckCore: "Core drill",
    deckCoreSub: "Targeted questions on each unit's key rules, with a worked explanation for every answer.",
    deckCtx: "Context practice",
    deckCtxSub: "Fuller, real-world contexts using everyday (Oxford 3000-level) vocabulary.",
    deckExtra: "Extra practice",
    deckExtraSub: "A large Oxford 3000-level bank — a fresh 10-question round each time.",
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
    heroTitle: "Kuasai aturannya, raih Band 7",
    heroSub: (n) => `Latihan tata bahasa interaktif — 13 unit dan ${n} soal latihan.`,
    statsLine: (p, m) => `${p}/13 unit dipelajari · ${m} dikuasai (80%+)`,
    lastEssay: (b) => ` · esai terakhir ${b}`,
    writingTitle: "Writing Lab",
    writingSub: "Tulis esai Task 2 dengan waktu ujian, lalu dapatkan estimasi band AI dengan umpan balik yang terhubung ke unit-unit ini.",
    unitsHeader: "Unit tata bahasa",
    unitsHint: "Pelajari, lalu latihan",
    newLabel: "Baru",
    footer: "Aplikasi belajar tata bahasa IELTS untuk pribadi — 13 unit aturan dan latihan soal terarah. Progres tersimpan di perangkat ini.",
    allUnits: "Semua unit",
    learnTab: "Materi",
    practiceTab: "Latihan",
    practiceBtn: "Latihan unit ini",
    deckCore: "Latihan inti",
    deckCoreSub: "Soal terarah untuk aturan tiap unit, dengan penjelasan di setiap jawaban.",
    deckCtx: "Latihan konteks",
    deckCtxSub: "Konteks sehari-hari yang lebih panjang dengan kosakata umum (level Oxford 3000).",
    deckExtra: "Latihan tambahan",
    deckExtraSub: "Bank soal besar level Oxford 3000 — 10 soal acak setiap ronde.",
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
  const totalQ = UNITS.reduce((n, u) => n + u.quiz.length + ((QUIZ2[u.id] || []).length) + ((QUIZ3[u.id] || []).length), 0);
  const last = history[0];
  return (
    <div>
      <div className="rounded-3xl overflow-hidden mb-5 flex" style={{ background: C.blue }}>
        <div style={{ width: 14, background: C.red, flexShrink: 0 }} />
        <div className="p-6 sm:p-8 text-white flex-1">
          <div className="text-xs font-bold mb-1" style={{ color: "#BFC7FF", letterSpacing: "0.16em" }}>IELTS GRAMMAR STUDIO</div>
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

      {AI_ENABLED && (
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
      )}

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
  const extraPool = QUIZ3[unit.id] || [];
  const extraRound = useMemo(() => {
    const s = (QUIZ3[unit.id] || []).slice();
    for (let k = s.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [s[k], s[j]] = [s[j], s[k]]; }
    return s.slice(0, EXTRA_ROUND);
  }, [unit.id, session]);

  if (!deck) {
    const decks = [
      { key: unit.id, list: unit.quiz, isCtx: false, title: tr.deckCore, sub: tr.deckCoreSub, icon: <Play size={22} />, wash: C.blueWash, color: C.blue },
      { key: "x" + unit.id, list: ctxList, isCtx: true, title: tr.deckCtx, sub: tr.deckCtxSub, icon: <Sparkles size={22} />, wash: C.redWash, color: C.red },
      { key: "e" + unit.id, list: extraPool, isCtx: true, round: true, title: tr.deckExtra, sub: tr.deckExtraSub, icon: <Layers size={22} />, wash: C.greenWash, color: C.green },
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
    <Quiz key={deck.key + "-" + session} list={deck.round ? extraRound : deck.list} unitId={unit.id} isCtx={deck.isCtx} lang={lang}
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
