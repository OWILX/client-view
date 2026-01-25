// assets/js/quiz.js

document.addEventListener('DOMContentLoaded', () => {
    /* --------------------------------------------------
       Platform detection & theming
    -------------------------------------------------- */
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const body = document.body;

    if (isIOS) body.classList.add('ios');
    if (isAndroid) body.classList.add('android');

    document.documentElement.style.setProperty(
        '--easing-default',
        isIOS ? 'var(--easing-ios)' : 'var(--easing-android)'
    );
    document.documentElement.style.setProperty(
        '--shadow-default',
        isIOS ? 'var(--shadow-soft)' : 'var(--shadow-material)'
    );

    /* --------------------------------------------------
       Mock content data
    -------------------------------------------------- */
    const contentData = {
        math: {
            topics: ['Algebra', 'Geometry', 'Calculus'],
            subtopics: {
                Algebra: ['Equations', 'Polynomials'],
                Geometry: ['Shapes', 'Theorems'],
                Calculus: ['Derivatives', 'Integrals']
            }
        },
        science: {
            topics: ['Physics', 'Chemistry', 'Biology'],
            subtopics: {
                Physics: ['Mechanics', 'Electricity'],
                Chemistry: ['Elements', 'Reactions'],
                Biology: ['Cells', 'Genetics']
            }
        },
        history: {
            topics: ['Ancient', 'Modern'],
            subtopics: {
                Ancient: ['Egypt', 'Rome'],
                Modern: ['WW1', 'WW2']
            }
        },
        literature: {
            topics: ['Poetry', 'Novels'],
            subtopics: {
                Poetry: ['Sonnet', 'Haiku'],
                Novels: ['Classics', 'Contemporary']
            }
        }
    };

    /* --------------------------------------------------
       DOM references
    -------------------------------------------------- */
    const slider = document.getElementById('question-count-slider');
    const sliderValue = document.getElementById('question-count-value');
    const startBtn = document.getElementById('start-quiz-btn');

    const setupSection = document.getElementById('quiz-setup');
    const progressSection = document.getElementById('quiz-in-progress');
    const resultsSection = document.getElementById('quiz-results');

    const timerDisplay = document.getElementById('timer-display');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const questionContainer = document.getElementById('question-container');

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    const headerTitle = document.querySelector('.header-title');

    /* --------------------------------------------------
       Quiz state
    -------------------------------------------------- */
    let quizType = null;
    let selectedCourses = [];
    let selectedTopics = [];
    let selectedSubtopics = [];
    let numQuestions = 10;

    let questions = [];
    let answers = {};
    let currentQuestion = 0;
    let timerInterval;
    let timeElapsed = 0;

    /* --------------------------------------------------
       STEP 1: Quiz type cards
    -------------------------------------------------- */
    document.querySelectorAll('.quiz-type-cards .selection-card').forEach(card => {
        card.addEventListener('click', () => {
            quizType = card.dataset.value;

            document
                .querySelectorAll('.quiz-type-cards .selection-card')
                .forEach(c => c.classList.remove('selected'));

            card.classList.add('selected');

            setTimeout(() => {
                document.getElementById('step-quiz-type').classList.add('hidden');
                const coursesStep = document.getElementById('step-courses');
                coursesStep.classList.remove('hidden');
                populateCourses();
            }, 300);
        });
    });

    /* --------------------------------------------------
       Shared selection toggle
    -------------------------------------------------- */
    function toggleSelection(e) {
        const card = e.currentTarget;
        const value = card.dataset.value;
        const stepId = card.closest('.setup-step').id;

        let selectedArray;
        let nextBtn;

        if (stepId === 'step-courses') {
            selectedArray = selectedCourses;
            nextBtn = document.getElementById('next-to-topics');
        } else if (stepId === 'step-topics') {
            selectedArray = selectedTopics;
            nextBtn = document.getElementById('next-to-subtopics');
        } else {
            selectedArray = selectedSubtopics;
            nextBtn = document.getElementById('next-to-slider');
        }

        const index = selectedArray.indexOf(value);
        if (index > -1) {
            selectedArray.splice(index, 1);
            card.classList.remove('selected');
        } else {
            selectedArray.push(value);
            card.classList.add('selected');
        }

        nextBtn.disabled = selectedArray.length === 0;
    }

    /* --------------------------------------------------
       Populate cards
    -------------------------------------------------- */
    function populateCourses() {
        const container = document.querySelector('#step-courses .selection-cards');
        container.innerHTML = '';

        Object.keys(contentData).forEach(course => {
            const card = document.createElement('div');
            card.className = 'selection-card';
            card.dataset.value = course;
            card.innerHTML = `
                <i class="fas fa-book card-icon"></i>
                <span>${course.charAt(0).toUpperCase() + course.slice(1)}</span>
            `;
            card.addEventListener('click', toggleSelection);
            container.appendChild(card);
        });
    }

    function populateTopics() {
        const container = document.querySelector('#step-topics .selection-cards');
        container.innerHTML = '';

        const allTopics = new Set();
        selectedCourses.forEach(course =>
            contentData[course].topics.forEach(t => allTopics.add(t))
        );

        allTopics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'selection-card';
            card.dataset.value = topic;
            card.innerHTML = `
                <i class="fas fa-folder card-icon"></i>
                <span>${topic}</span>
            `;
            card.addEventListener('click', toggleSelection);
            container.appendChild(card);
        });
    }

    function populateSubtopics() {
        const container = document.querySelector('#step-subtopics .selection-cards');
        container.innerHTML = '';

        const allSubtopics = new Set();
        selectedCourses.forEach(course => {
            selectedTopics.forEach(topic => {
                const subs = contentData[course].subtopics[topic];
                if (subs) subs.forEach(s => allSubtopics.add(s));
            });
        });

        allSubtopics.forEach(sub => {
            const card = document.createElement('div');
            card.className = 'selection-card';
            card.dataset.value = sub;
            card.innerHTML = `
                <i class="fas fa-file card-icon"></i>
                <span>${sub}</span>
            `;
            card.addEventListener('click', toggleSelection);
            container.appendChild(card);
        });
    }

    /* --------------------------------------------------
       Step navigation
    -------------------------------------------------- */
    document.getElementById('next-to-topics').addEventListener('click', () => {
        document.getElementById('step-courses').classList.add('hidden');
        document.getElementById('step-topics').classList.remove('hidden');
        populateTopics();
    });

    document.getElementById('next-to-subtopics').addEventListener('click', () => {
        document.getElementById('step-topics').classList.add('hidden');
        document.getElementById('step-subtopics').classList.remove('hidden');
        populateSubtopics();
    });

    document.getElementById('next-to-slider').addEventListener('click', () => {
        document.getElementById('step-subtopics').classList.add('hidden');
        document.getElementById('step-slider').classList.remove('hidden');
    });

    /* --------------------------------------------------
       Slider (with gradient + bubble)
    -------------------------------------------------- */
    slider.addEventListener('input', () => {
        numQuestions = slider.value;
        sliderValue.textContent = numQuestions;

        const percent =
            ((numQuestions - slider.min) / (slider.max - slider.min)) * 100;

        slider.style.setProperty('--value', percent + '%');

        const thumbPos = (percent * (slider.offsetWidth - 32)) / 100;
        sliderValue.style.left = `calc(${thumbPos}px + 16px)`;
    });

    /* --------------------------------------------------
       Quiz lifecycle
    -------------------------------------------------- */
    startBtn.addEventListener('click', () => {
        if (!quizType || selectedSubtopics.length === 0) {
            alert('Complete all steps first.');
            return;
        }

        generateQuestions();
        renderQuestion(currentQuestion);
        startTimer();

        setupSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        headerTitle.textContent = 'Quiz';
        totalQuestionsSpan.textContent = numQuestions;
    });

    function generateQuestions() {
        questions = [];
        for (let i = 0; i < numQuestions; i++) {
            questions.push({
                text: `Sample ${quizType.toUpperCase()} question ${i + 1}.`,
                options:
                    quizType === 'mcq'
                        ? ['A', 'B', 'C', 'D']
                        : quizType === 'tf'
                        ? ['True', 'False']
                        : null
            });
        }
    }

    function renderQuestion(index) {
        currentQuestionSpan.textContent = index + 1;

        questionContainer.innerHTML = `
            <p class="question-text">${questions[index].text}</p>
            <div class="answer-options">
                ${
                    quizType === 'cloze'
                        ? `<input type="text" class="cloze-input" placeholder="Fill in the blank">`
                        : questions[index].options
                              .map(
                                  opt => `
                            <label class="answer-label">
                                <input type="radio" name="answer" value="${opt}" ${
                                      answers[index] === opt ? 'checked' : ''
                                  }>
                                <span>${opt}</span>
                            </label>`
                              )
                              .join('')
                }
            </div>
        `;

        if (quizType === 'cloze') {
            const input = questionContainer.querySelector('.cloze-input');
            input.value = answers[index] || '';
            input.addEventListener('input', e => (answers[index] = e.target.value));
        } else {
            questionContainer
                .querySelectorAll('input[name="answer"]')
                .forEach(radio =>
                    radio.addEventListener(
                        'change',
                        e => (answers[index] = e.target.value)
                    )
                );
        }

        prevBtn.disabled = index === 0;
        nextBtn.classList.toggle('hidden', index === numQuestions - 1);
        submitBtn.classList.toggle('hidden', index !== numQuestions - 1);
    }

    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion(currentQuestion);
        }
    });

    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        renderQuestion(currentQuestion);
    });

    submitBtn.addEventListener('click', endQuiz);

    function startTimer() {
        timeElapsed = 0;
        timerInterval = setInterval(() => {
            timeElapsed++;
            const mins = String(Math.floor(timeElapsed / 60)).padStart(2, '0');
            const secs = String(timeElapsed % 60).padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function endQuiz() {
        clearInterval(timerInterval);

        const score = Object.keys(answers).length;
        document.getElementById('score-display').textContent = `${score}/${numQuestions}`;
        document.getElementById('time-taken').textContent = timerDisplay.textContent;

        let userData = JSON.parse(localStorage.getItem('letstudy_user')) || {};
        userData.quizzesCompleted = (userData.quizzesCompleted || 0) + 1;
        userData.streak = (userData.streak || 0) + 1;
        localStorage.setItem('letstudy_user', JSON.stringify(userData));

        progressSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        headerTitle.textContent = 'Quiz Results';
    }

    restartBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        setupSection.classList.remove('hidden');
        headerTitle.textContent = 'Quiz Setup';

        answers = {};
        currentQuestion = 0;
        selectedCourses = [];
        selectedTopics = [];
        selectedSubtopics = [];
        quizType = null;
    });

    /* --------------------------------------------------
       Touch interactions
    -------------------------------------------------- */
    const btns = document.querySelectorAll(
        '.primary-btn, .secondary-btn, .selection-card, .answer-label'
    );

    if (isAndroid) {
        btns.forEach(btn => btn.addEventListener('touchstart', createRipple));
    } else if (isIOS) {
        btns.forEach(btn => {
            btn.addEventListener(
                'touchstart',
                () => (btn.style.backgroundColor = 'var(--gray-100)')
            );
            btn.addEventListener('touchend', () => (btn.style.backgroundColor = ''));
        });
    }

    function createRipple(e) {
        const rect = this.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        if (navigator.vibrate) navigator.vibrate(10);
    }
});