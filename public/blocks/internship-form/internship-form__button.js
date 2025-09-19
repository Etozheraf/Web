document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.internship-form');
    const internshipTable = document.querySelector('.internships-table').querySelector('tbody');

    function addInternshipToTable(name, status, dates) {
        const newRow = internshipTable.insertRow();

        const nameCell = newRow.insertCell(0);
        nameCell.classList.add('internships-table__td');
        
        const statusCell = newRow.insertCell(1);
        statusCell.classList.add('internships-table__td');
        
        const datesCell = newRow.insertCell(2);
        datesCell.classList.add('internships-table__td');
        
        const actionsCell = newRow.insertCell(3);
        actionsCell.classList.add('internships-table__td');
        actionsCell.classList.add('internships-table__td_last');

        nameCell.textContent = name;
        statusCell.textContent = status;
        datesCell.textContent = dates;

        const deleteButton = document.createElement('button');

        deleteButton.textContent = '✖';
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.color = 'red';
        deleteButton.style.cursor = 'pointer';

        deleteButton.onclick = () => {
            internshipTable.deleteRow(newRow.rowIndex - 1);
            saveInternships();
        };

        actionsCell.appendChild(deleteButton);
    }

    function loadInternships() {
        const savedInternships = localStorage.getItem('internships');
        if (savedInternships) {
            const internships = JSON.parse(savedInternships);
            internships.forEach(internship => {
                addInternshipToTable(internship.name, internship.status, internship.dates);
            });
        }
    }
    
    function saveInternships() {
        const internships = [];
        for (let i = 0; i < internshipTable.rows.length; i++) {
            const row = internshipTable.rows[i];
            internships.push({
                name: row.cells[0].textContent,
                status: row.cells[1].textContent,
                dates: row.cells[2].textContent
            });
        }
        localStorage.setItem('internships', JSON.stringify(internships));
    }


    loadInternships();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const internshipName = form.internshipName.value;
        const status = form.status.value;
        const dates = form.dates.value;

        if (!internshipName) {
            toastr.error('Пожалуйста, введите название стажировки.', 'Ошибка');
            return;
        }

        addInternshipToTable(internshipName, status, dates);
        saveInternships();
        form.reset();
    });
});
