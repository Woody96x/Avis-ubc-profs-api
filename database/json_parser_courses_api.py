import requests
from database import Professor, Course, Grades, Stats, db, app

stats_cat = ['average', 'stdev', 'high', 'low',
             'pass', 'fail', 'withdrew', 'audit', 'other']
grades_cat = ['0-9%', '10-19%', '20-29%', '30-39%', '40-49%', '<50%', '50-54%', '55-59%',
              '60-63%', '64-67%', '68-71%', '72-75%', '76-79%', '80-84%', '85-89%', '90-100%']

url = 'https://ubcgrades.com/api/v2/grades/UBCV/'
years = ['2019W', '2019S', '2020W', '2020S', '2021W', '2021S']

with app.app_context():
    for year in years:
        year_grades = requests.get(url + year).json()
        for course in year_grades:
            if course['educators'].strip(' ') != '':
                course_id = 'UBCV-{}-{}-{}-{}'.format(
                    year, course['subject'], course['course'], course['section'])
                if db.session.query(Course.id).filter_by(course_id=course_id).scalar() is None:
                    gless50 = 0 if course['grades'][grades_cat[5]
                                                    ] == '' else course['grades'][grades_cat[5]]
                    g50to54 = 0 if course['grades'][grades_cat[6]
                                                    ] == '' else course['grades'][grades_cat[6]]
                    g55to59 = 0 if course['grades'][grades_cat[7]
                                                    ] == '' else course['grades'][grades_cat[7]]
                    g60to63 = 0 if course['grades'][grades_cat[8]
                                                    ] == '' else course['grades'][grades_cat[8]]
                    g64to67 = 0 if course['grades'][grades_cat[9]
                                                    ] == '' else course['grades'][grades_cat[9]]
                    g68to71 = 0 if course['grades'][grades_cat[10]
                                                    ] == '' else course['grades'][grades_cat[10]]
                    g72to75 = 0 if course['grades'][grades_cat[11]
                                                    ] == '' else course['grades'][grades_cat[11]]
                    g76to79 = 0 if course['grades'][grades_cat[12]
                                                    ] == '' else course['grades'][grades_cat[12]]
                    g80to84 = 0 if course['grades'][grades_cat[13]
                                                    ] == '' else course['grades'][grades_cat[13]]
                    g85to89 = 0 if course['grades'][grades_cat[14]
                                                    ] == '' else course['grades'][grades_cat[14]]
                    g90to100 = 0 if course['grades'][grades_cat[15]
                                                     ] == '' else course['grades'][grades_cat[15]]
                    curr_course = Course(course_id=course_id, year_session=course['year'] + course['session'], campus=course['campus'],
                                         subject=course['subject'], course=course['course'], section=course['section'],
                                         title=course['course_title'], enrolled=course['enrolled'])
                    curr_grades = Grades(g0to9=0, g10to19=0, g20to29=0,
                                         g30to39=0, g40to49=0, gless50=gless50,
                                         g50to54=g50to54, g55to59=g55to59, g60to63=g60to63,
                                         g64to67=g64to67, g68to71=g68to71, g72to75=g72to75, g76to79=g76to79, g80to84=g80to84, g85to89=course[
                                             'grades'][grades_cat[14]],
                                         g90to100=g90to100, course=curr_course)
                    curr_stats = Stats(average=course[stats_cat[0]], stdev=course[stats_cat[1]], high=course[stats_cat[2]],
                                       low=course[stats_cat[3]], passed=(course['enrolled'] - g50to54), fail=course['grades'][grades_cat[5]],
                                       withdrew=0, audit=0, other=0, course=curr_course)
                    db.session.add(curr_course)
                    db.session.add(curr_grades)
                    db.session.add(curr_stats)
                    print('added course for {} in year {}'.format(
                        curr_course.course_id, curr_course.year_session))

                    instructors = course['educators'].split(';')
                    for instructor_name in instructors:
                        temp = instructor_name.split()
                        if len(temp) > 1:
                            temp[-1] += ','
                            temp = [temp[-1]] + temp[:-1]
                            instructor_name = ' '.join(temp)
                        if db.session.query(Professor.id).filter_by(name=instructor_name).scalar() is None:
                            curr_professor = Professor(name=instructor_name)
                            db.session.add(curr_professor)
                        else:
                            curr_professor = Professor.query.filter_by(
                                name=instructor_name).first()
                        curr_course.professors.append(curr_professor)
                        print('added professor named {} for course {} in year {}'.format(
                            curr_professor.name, curr_course.course_id, curr_course.year_session))
                db.session.commit()
            db.session.commit()
        db.session.commit()
