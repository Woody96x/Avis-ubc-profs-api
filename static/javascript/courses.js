// TODO: Once they type something, clear form from subject, course, year

function formatProfName(profName) {
    profName = profName.replace(/, /g, '-');
    profName = profName.replace(/ /g, '-');
    return profName;
}

function profSearchCustom() {
    let profInput = $('#search-input-prof').val();
    profInput = formatProfName(profInput);
    const subject = $('#dropdownMenuButtonSubject');
    const course = $('#dropdownMenuButtonCourse');
    const year = $('#dropdownMenuButtonYear');
    const section = $('#dropdownMenuButtonSection');

    if (subject.text() === "All") {
        searchSpecific(`/api/general-stats/${profInput}`);
    } else if (course.text() === "All") {
        searchSpecific(`/api/general-stats/${profInput}/${subject.text()}`)
    } else if (year.text() === "All") {
        searchSpecific(`/api/general-stats/${profInput}/${subject.text()}/${course.text()}`)
    } else if (section.text() === "All") {
        searchSpecific(`/api/general-stats/${profInput}/${subject.text()}/${course.text()}/${year.text()}`)
    } else {
        searchSpecific(`/api/general-stats/${profInput}/${subject.text()}/${course.text()}/${year.text()}/${section.text()}`)
    }
}

function searchSpecific(theUrl) {
    const submit = $.ajax({
        type: "GET",
        url: theUrl
    });

    submit.done(function gotResults(res) {
        stats = res;
        course = $('#dropdownMenuButtonCourse');
        if (course.text() === '5' || course.text() === '6' || course.text() === '7' || course.text() === '8' || course.text() === '9') {

        }
    });

    submit.fail(function noResult(err) {
        console.log(err, "Certified Bruh Moment");
    });
}

function clearCourse() {
    $('#dropdownMenuButtonCourse').text('All');
    const course = $('#course-dropdown');
    course.empty();
    course.append('<a class="dropdown-item" href="javascript:void(0)">All</a>');
}

function clearYear() {
    $('#dropdownMenuButtonYear').text('All');
    const year = $('#year-dropdown');
    year.empty();
    year.append('<a class="dropdown-item" href="javascript:void(0)">All</a>')
}

function clearSection() {
    $('#dropdownMenuButtonSection').text('All');
    const section = $('#section-dropdown');
    section.empty();
    section.append('<a class="dropdown-item" href="javascript:void(0)">All</a>')
}

$('#subject-dropdown').on('click', 'a', function clickOnSubjectResult() {
    let prof = $('#search-input-prof').val();
    prof = formatProfName(prof);

    clearCourse();
    clearYear();
    clearSection();

    const click_text = $(this).text().split('|');
    $('#dropdownMenuButtonSubject').text(click_text[0]);

    const submit = $.ajax({
        type: "GET",
        url: `/api/subjects/${prof}/${click_text[0]}`
    });

    submit.done(function getAllYears(res) {
        const course_dropdown = $('#course-dropdown');
        for (let course of res) {
            course_dropdown.append('<a class="dropdown-item" href="javascript:void(0)">' + course + '</a>')
        }
    });

    submit.fail(function failed(msg) {
        console.log(msg, "F");
    })
});

$('#course-dropdown').on('click', 'a', function clickOnSubjectResult() {
    let prof = $('#search-input-prof').val();
    prof = formatProfName(prof);
    const subject = $('#dropdownMenuButtonSubject').text();

    clearYear();
    clearSection();

    const click_text = $(this).text().split('|');
    $('#dropdownMenuButtonCourse').text(click_text[0]);

    const submit = $.ajax({
        type: "GET",
        url: `/api/years/${prof}/${subject}/${click_text[0]}`
    });

    submit.done(function getAllYears(res) {
        const year_dropdown = $('#year-dropdown');
        for (let year of res) {
            year_dropdown.append('<a class="dropdown-item" href="javascript:void(0)">' + year + '</a>')
        }
    });

    submit.fail(function failed(msg) {
        console.log(msg, "F");
    })
});

$('#year-dropdown').on('click', 'a', function clickOnSubjectResult() {
    let prof = $('#search-input-prof').val();
    prof = formatProfName(prof);
    const subject = $('#dropdownMenuButtonSubject').text();
    const course = $('#dropdownMenuButtonCourse').text();

    clearSection();

    const click_text = $(this).text().split('|');
    $('#dropdownMenuButtonYear').text(click_text[0]);

    const submit = $.ajax({
        type: "GET",
        url: `/api/sections/${prof}/${subject}/${course}/${click_text[0]}`
    });

    submit.done(function getAllSections(res) {
        const section_dropdown = $('#section-dropdown');
        for (let section of res) {
            section_dropdown.append('<a class="dropdown-item" href="javascript:void(0)">' + section + '</a>')
        }
    });

    submit.fail(function failed(msg) {
        console.log(msg, "F");
    })
});

$('#section-dropdown').on('click', 'a', function clickOnSubjectResult() {
    const click_text = $(this).text().split('|');
    $('#dropdownMenuButtonSection').text(click_text[0]);
});
