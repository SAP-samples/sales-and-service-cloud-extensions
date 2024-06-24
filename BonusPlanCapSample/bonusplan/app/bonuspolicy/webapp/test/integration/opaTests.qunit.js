sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bonuspolicy/bonuspolicy/test/integration/FirstJourney',
		'bonuspolicy/bonuspolicy/test/integration/pages/BonusPoliciesList',
		'bonuspolicy/bonuspolicy/test/integration/pages/BonusPoliciesObjectPage',
		'bonuspolicy/bonuspolicy/test/integration/pages/BonusRatesObjectPage'
    ],
    function(JourneyRunner, opaJourney, BonusPoliciesList, BonusPoliciesObjectPage, BonusRatesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bonuspolicy/bonuspolicy') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBonusPoliciesList: BonusPoliciesList,
					onTheBonusPoliciesObjectPage: BonusPoliciesObjectPage,
					onTheBonusRatesObjectPage: BonusRatesObjectPage
                }
            },
            opaJourney.run
        );
    }
);