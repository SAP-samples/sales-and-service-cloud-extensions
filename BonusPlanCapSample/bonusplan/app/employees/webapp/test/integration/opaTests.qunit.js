sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'employees/test/integration/FirstJourney',
		'employees/test/integration/pages/EmployeesList',
		'employees/test/integration/pages/EmployeesObjectPage',
		'employees/test/integration/pages/BonusPlansObjectPage'
    ],
    function(JourneyRunner, opaJourney, EmployeesList, EmployeesObjectPage, BonusPlansObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('employees') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEmployeesList: EmployeesList,
					onTheEmployeesObjectPage: EmployeesObjectPage,
					onTheBonusPlansObjectPage: BonusPlansObjectPage
                }
            },
            opaJourney.run
        );
    }
);