// Initialize your app
var myApp = new Framework7({
    material: true,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

//FORM FUNCTIONS
var sex = function () {
    return $$("input[name='sex']:checked").val();
};
var tniLow = function () {
    if (sex() === "m") {
        return 35;
    }
    if (sex() === "f") {
        return 16;
    }
};
var tniHigh = function () {
    if (sex() === "m") {
        return 105;
    }
    if (sex() === "f") {
        return 48;
    }
};
var tniVal = function () {
    return parseInt($$("input[name='hstnival']").val());
};
var tniScore = function () {
    if (tniVal() >= tniHigh()) {
        return 2;
    } else if (tniVal() < tniLow()) {
        return 0;
    } else {
        return 1;
    }
};
var painVal = function () {
    if ($$("input[name='pain-box']:checked").length > 0) {
        return $$("input[name='pain-box']:checked").length - 1;
    } else {
        return 0;
    }
};

var riskVal = function () {
    if ($$("input[name='risk-box']:checked").val() === "a") {
        return 2;
    } else if ($$("input[name='risk-box']:checked").length === 0) {
        return 0;
    } else if ($$("input[name='risk-box']:checked").length <= 2) {
        return 1;
    } else {
        return 2;
    }
};

var myKeypad = $$('input[type="numpad"]')[0].f7Keypad;

function checkForm() {
    var heartscore = 0;
    heartscore = tniScore() + parseInt($$("input[name='age']:checked").val()) + painVal() + parseInt($$("input[name='ecg']:checked").val()) + riskVal();
    if (heartscore < 4) {
        //LOW RISK
        $$("p.first").html("HEART score " + heartscore + " - Låg risk");
        if (tniVal() < 5) {
            $$(".bottom-toolbar").css("background", "#00c853");
            $$("p.second").html("AKS ej sannolikt");
            //Not probable
        } else if (tniVal() >= 5 && tniVal() < tniLow()) {
            $$(".bottom-toolbar").css("background", "#fbc02d");
            $$("p.second").html("Tag 1h-prov, om &Delta; < 6 AKS ej sannolikt, om &Delta; > 6 handlägg som AKS");
            //New test 1h, Delta below 6 not probable, over 6 treat as AKS
        } else if (tniVal() >= tniLow()) {
            $$(".bottom-toolbar").css("background", "#f57c00");
            $$("p.second").html("Stämmer symptomen? Dynamik? Diskutera med medicinjour/kardiologjour? - AKS?");
            //Contact medicine cardio - AKS?
        }
    } else if (heartscore >= 4 && heartscore <= 7) {
        //INTERMEDIATE
        $$("p.first").html("HEART score " + heartscore + " - Intermediär risk");
        if (tniVal() < tniLow()) {
            $$(".bottom-toolbar").css("background", "#f57c00");
            $$("p.second").html("Tag 3h-prov, dynamik? Högriskpatient!");
            //New test 3h, dynamic? High risk patient!
        } else if (tniVal() >= tniLow()) {
            $$(".bottom-toolbar").css("background", "#ff3d00");
            $$("p.second").html("Handlägg som AKS om ej annan diagnos mer sannolik!");
            //AKS!
        }
    } else if (heartscore >= 8) {
        //HIGH
        $$("p.first").html("HEART score " + heartscore + " - Hög risk");
        if (tniVal() < tniLow()) {
            //New test 3h, dynamic? High risk patient!
            $$(".bottom-toolbar").css("background", "#f57c00");
            $$("p.second").html("Tag 3h-prov, dynamik? Högriskpatient!");
        } else if (tniVal() >= tniLow()) {
            //AKS!
            $$(".bottom-toolbar").css("background", "#ff3d00");
            $$("p.second").html("Handlägg som AKS om ej annan diagnos mer sannolik!");
        }
    }
    if (heartscore > 0 && tniVal() > -1) {
        $$(".bottom-toolbar").show();
    } else if (tniVal() > -1 && sex() && $$("input[name='age']:checked").val() && $$("input[name='ecg']:checked").val()) {
        $$(".bottom-toolbar").show();
    }
}
$$('form').change(function () {
    $$("input[name='storetime']").val(new Date().getTime());
    checkForm();
});

if (parseInt((new Date().getTime()) - parseInt($$("input[name='storetime']").val())) > 300000) {
    document.getElementById("hstniform").reset();
    myApp.formDeleteData('hstniform');
    $$("input[name='hstnival']").val('');
    myKeypad.setValue('');
}

function clearForm() {
    document.getElementById("hstniform").reset();
    myApp.formDeleteData('hstniform');
    $$("input[name='hstnival']").val('');
    myKeypad.setValue('');
    $$(".page-content").scrollTop(0, 500);
}