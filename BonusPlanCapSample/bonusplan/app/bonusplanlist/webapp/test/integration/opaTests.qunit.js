sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'bonusplanlist/test/integration/FirstJourney',
		'bonusplanlist/test/integration/pages/BonusPlansList',
		'bonusplanlist/test/integration/pages/BonusPlansObjectPage',
		'bonusplanlist/test/integration/pages/BonusDetailsObjectPage'
    ],
    function(JourneyRunner, opaJourney, BonusPlansList, BonusPlansObjectPage, BonusDetailsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('bonusplanlist') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBonusPlansList: BonusPlansList,
					onTheBonusPlansObjectPage: BonusPlansObjectPage,
					onTheBonusDetailsObjectPage: BonusDetailsObjectPage
                }
            },
            opaJourney.run
        );
    }
);