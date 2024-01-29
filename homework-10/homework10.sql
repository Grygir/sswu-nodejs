CREATE SCHEMA main;

CREATE TABLE IF NOT EXISTS main.positions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL
);

INSERT INTO main.positions (name) VALUES
  ('Engineer'),
  ('QA'),
  ('PM'),
  ('Devops'),
  ('Designer');

CREATE TABLE IF NOT EXISTS main.levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) UNIQUE NOT NULL
);

INSERT INTO main.levels (name) VALUES
  ('Intern'),
  ('Junior'),
  ('Middle'),
  ('Senior');

CREATE TABLE main.employees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  position_id INT NOT NULL,
  level_id INT NOT NULL,
  salary NUMERIC(10, 2) NOT NULL,
  FOREIGN KEY (position_id) REFERENCES main.positions (id),
  FOREIGN KEY (level_id) REFERENCES main.levels (id)
);

CREATE INDEX employee_name_index ON main.employees (first_name, last_name, id);

INSERT INTO main.employees (first_name, last_name, position_id, level_id, salary) VALUES
  ('Mattie', 'Wang', 1, 1, 10),
  ('Keisha', 'Mckay', 1, 2, 1500),
  ('Isobel', 'Lloyd', 1, 3, 2500),
  ('Virgil', 'Wyatt', 1, 4, 3500),
  ('Sapphire', 'Kane', 1, 4, 3700),
  ('Gerard', 'Pacheco', 2, 2, 1400),
  ('Annalise', 'Vincent', 2, 3, 2200),
  ('Mikolaj', 'Barton', 3, 3, 3800),
  ('Lorcan', 'O''Moore', 3, 4, 4500),
  ('Aled', 'Hudson', 4, 3, 2900),
  ('Mariah', 'Valenzuela', 4, 4, 3700),
  ('Jim', 'Horne', 5, 3, 2700),
  ('Lenny', 'Bass', 5, 4, 3200),
  ('Jacques', 'Gilbert', 1, 4, 3600),
  ('Hanna', 'Becker', 2, 4, 3200);

CREATE TABLE main.projects (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  deadline DATE,
  budget NUMERIC(10, 2)
);

CREATE INDEX project_code_index ON main.projects (code, id);

INSERT INTO main.projects (code, title, deadline, budget) VALUES
  ('GGL', 'Google', null, 3700),
  ('AMZ', 'Amazon', null, 2700),
  ('APL', 'Apple', '2024-12-15', 3200),
  ('DELL', 'Dell', '2025-02-02', 3600),
  ('IBM', 'IBM', '2025-06-17', 3200);

CREATE TABLE main.employee_projects (
  employee_id INT NOT NULL,
  project_id INT NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES main.employees (id),
  FOREIGN KEY (project_id) REFERENCES main.projects (id),
  UNIQUE (employee_id, project_id)
);

INSERT INTO main.employee_projects (employee_id, project_id) VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (14, 1),
  (15, 1),
  (9, 1),
  (11, 1),
  (13, 1),
  (3, 2),
  (4, 2),
  (7, 2),
  (8, 2),
  (10, 2),
  (12, 2),
  (13, 3),
  (12, 3),
  (10, 3),
  (9, 3),
  (15, 3),
  (7, 3),
  (4, 3),
  (5, 3),
  (14, 3);

CREATE TABLE main.mentors (
  mentor_id INT NOT NULL,
  mentee_id INT NOT NULL CHECK ( mentee_id != mentor_id ) UNIQUE,
  FOREIGN KEY (mentor_id) REFERENCES main.employees (id),
  FOREIGN KEY (mentee_id) REFERENCES main.employees (id),
  PRIMARY KEY (mentor_id, mentee_id)
);

INSERT INTO main.mentors (mentor_id, mentee_id) VALUES
  (13, 12),
  (11, 10),
  (9, 8),
  (15, 6),
  (15, 7),
  (3, 1),
  (5, 2),
  (4, 3);


-- Хто зі співробітників призначений на конкретний проект?
SELECT first_name, last_name FROM main.employees
  JOIN main.employee_projects ep on employees.id = ep.employee_id
  JOIN main.projects p on ep.project_id = p.id
WHERE p.code = 'GGL';

-- Хто з розробників рівня senior призначений на конкретний проект?
SELECT first_name, last_name FROM main.employees
  JOIN main.employee_projects ep on employees.id = ep.employee_id
  JOIN main.projects p ON ep.project_id = p.id
  JOIN main.levels l ON employees.level_id = l.id
WHERE p.code = 'GGL' AND l.name = 'Senior';

-- Хто зі співробітників не призначений на жоден проект?
SELECT first_name, last_name FROM main.employees
  LEFT JOIN main.employee_projects ep ON employees.id = ep.employee_id
WHERE ep.project_id IS NULL;

-- Хто зі співробітників призначений на більше ніж один проект?
SELECT first_name, last_name FROM main.employees
  JOIN main.employee_projects ep ON employees.id = ep.employee_id
GROUP BY
  employees.id
HAVING
  COUNT(employees.id) > 1;

-- Чиїм ментором є певний співробітник за умови що ми знаємо його id?
SELECT first_name, last_name FROM main.employees
  JOIN main.mentors m ON employees.id = m.mentee_id
WHERE m.mentor_id = 15;

-- В кого зі співробітників немає ментора?
SELECT first_name, last_name FROM main.employees
  LEFT JOIN main.mentors m ON employees.id = m.mentee_id
WHERE m.mentor_id IS NULL;

-- Хто є ПМ-ом певного проекту?
SELECT first_name, last_name FROM main.employees
  JOIN main.employee_projects ep on employees.id = ep.employee_id
  JOIN main.projects p on ep.project_id = p.id
  JOIN main.positions pos on employees.position_id = pos.id
WHERE p.code = 'GGL' AND pos.name = 'PM';

-- Хто є ментором співробітника, імʼя та прізвище якого нам відомо?
SELECT employees.first_name, employees.last_name FROM main.employees
  JOIN main.mentors m ON employees.id = m.mentor_id
  JOIN main.employees em ON m.mentee_id = em.id
WHERE em.first_name = 'Mattie' AND em.last_name = 'Wang';


-- Співробітник отримує підвищення та переводиться з проекту А на проект Б. Необхідно оновити його level,
-- зарплату та проект, на якому він працює, знаючи його імʼя та прізвище
BEGIN;

UPDATE main.employees
SET level_id = 2, salary = 1200
WHERE first_name = 'Mattie' AND last_name = 'Wang';

DELETE FROM main.employee_projects
WHERE employee_projects.employee_id IN (
  SELECT id FROM main.employees
  WHERE first_name = 'Mattie' AND last_name = 'Wang'
) AND employee_projects.project_id IN (
  SELECT id FROM main.projects
  WHERE projects.code = 'GGL'
);

INSERT INTO main.employee_projects (employee_id, project_id)
  SELECT employees.id, projects.id FROM main.employees, main.projects
  WHERE first_name = 'Mattie' AND last_name = 'Wang' AND projects.code = 'IBM';

END;


-- Сценарій: Співробітник звільняється. Необхідно видалити його з системи, враховуючи проекти,
-- в яких він був учасником та відносини ментор-менті
BEGIN;

DELETE FROM main.employee_projects USING main.employees
WHERE first_name = 'Isobel' AND last_name = 'Lloyd';

DELETE FROM main.mentors USING main.employees
WHERE first_name = 'Isobel' AND last_name = 'Lloyd';

DELETE FROM main.employees
WHERE first_name = 'Isobel' AND last_name = 'Lloyd';

END;


-- Створити роль hr_manager та надати йому права для читання та оновлення таблиці employees
CREATE ROLE hr_manager;
GRANT USAGE ON SCHEMA main TO hr_manager;
GRANT ALL ON TABLE main.employees TO hr_manager;
GRANT SELECT ON TABLE main.positions, main.levels TO hr_manager;


-- Створити роль employee та надати йому права читати таблицю employees,
-- але не надавати доступ до даних про розмір зарплати співробітників
CREATE ROLE employee;
GRANT USAGE ON SCHEMA main TO employee ;
GRANT SELECT ON TABLE main.positions, main.levels TO employee;
GRANT SELECT (first_name, last_name, position_id, level_id) ON TABLE main.employees TO employee;
