/**
 * Created by JFCS on 2/26/16.
 */
var employeeArray = [];
var total = 0;
var primaryKey = 0;
var randomNum = 0;
var marvelArray=[];

$(document).ready(function(){
    init();
    enable();

});

function init(){
   for(var i = 0; i < employeeArray.length; i++) {
       appendDom(employeeArray[i]);

   }
    calcMonthlyPayroll(employeeArray);
}

function enable(){
    $('.empContainer').on('click','.delete',deleteEmployee);
    //$('.toggleForm').on('click',toggle);
    $('#employee-form').on('submit',processForm);

}

// moved all appending into ajax callback  was having async issues,

function appendDom(employee){
    primaryKey++;
    employee.key = primaryKey;
    marvel(employee);


}

function Employee(firstname, lastname, id , title, salary ) {
    this.firstName = firstname;
    this.lastName = lastname;
    this.employeeId = id;
    this.employeeTitle = title ;
    this.employeeSalary = salary ;

    employeeArray.push(this);
}

var deadpool = new Employee('Wade', 'Wilson', 1999, 'Deadpool',55000);
var ghostRider = new Employee('Johnny','Blaze',1968,"Ghost Rider",24000);
var doctorStrange = new Employee('Vincent','Strange',1969,"Doctor Strange",360000);
//var spidey = new Employee('Peter','Parker',1967,"Spider-Man",29000);
var magneto = new Employee('Max','Eisenhardt',1965,"Magneto",240000);
var cyclops = new Employee('Scott','Summers',1963,"Cyclops",47000);
//var profX = new Employee('Charles','Xavier',1964,"Professor X",65000);
var beast = new Employee('Hank','Mccoy',1966,"Beast",24000);
var starLord = new Employee('Peter','Quill',1976,"Star-Lord",24000);
//var hulk = new Employee('Bruce','Banner',1977,"Hulk",214000);
//var ironMan = new Employee('Tony','Stark',1976,"Iron Man",12124000);
var bob = new Employee('Bob','Agent of Hydra',1986,"Bob",55000);

function deleteEmployee(){
    removeFromPayroll( $(this).parent().data().data );
    $(this).parent().remove();
}


function processForm(event){
    event.preventDefault();
// code from scott
    var values = {};
    $.each($('#employee-form').serializeArray(), function(i,field){
        values[field.name] = field.value;
    });
    console.log(values);

    // ryans version of serialize array.
    // var formDataArray = $('employee-form').serializeArray();
    // console.log(formDataArray);
    // for var (i = 0; i<formDataArray.length;i++){
    //  values[formDataArray[i].name] = formDataArray[i].value;
    // }
    //
    //



    appendDom(values);
    employeeArray.push(values);
    $('#employee-form').find('input[type=text],input[type=number]').val("");
    calcMonthlyPayroll(employeeArray);

}

function calcMonthlyPayroll(employeeArray) {
    total = 0;
    for (var i = 0; i < employeeArray.length; i++) {
        if (employeeArray[i].employeeSalary) {
            total += Math.round((parseInt(employeeArray[i].employeeSalary) / 12));
        }
    }
    $('.total-monthly-salary').html('Current Monthly Payroll is : $' + total);
}
console.log(employeeArray);

function removeFromPayroll(dataFromDiv){
    console.log(dataFromDiv);
    for(var i = 0; i < employeeArray.length; i++) {
        if (dataFromDiv == employeeArray[i].key){
            employeeArray.splice(i,1);

            calcMonthlyPayroll(employeeArray);
        }
    }
}

function marvel (employee){
    var name = employee.employeeTitle;
    var marvelApiImage = {};
    var marvelCharId = 0;
    $.ajax({
        type:'GET',
        url: "http://gateway.marvel.com//v1/public/characters?nameStartsWith="+name+"&",
        data:
        {"apikey":"You Can Sign up for",
        "ts": "Your Own Key AT",
        "hash": "devolpers.marvel.com"},
        headers: {   Accept:'*/*' },
        success: function(response){
            console.log(response);
            if(response.data.results.length > 0) {
                randomNumber(0,response.data.results.length -1);
                marvelApiImage = response.data.results[randomNum].thumbnail.path + "/standard_xlarge.jpg";
                marvelCharId = response.data.results[randomNum].id;
                console.log(marvelCharId);
            } else {
                marvelApiImage = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/standard_xlarge.jpg";
            }
            employee.image = marvelApiImage;
            marvelArray.push(response);

            $('.empContainer').append("<div class='well col-sm-3'></div>");
            $el = $('.empContainer').children().last();
            $el.data('data',employee.key);
            $el.append('<p>Name: ' + employee.firstName + ' '+ employee.lastName + '</p>');
            $el.append('<p>Id #: ' + employee.employeeId + '</p>');
            $el.append('<p>Alias: ' + employee.employeeTitle + '</p>');
            $el.append('<p>Salary: ' + employee.employeeSalary + '</p>');
            $el.append('<img class="img-responsive img-circle" src=' + employee.image + ' >');
            $el.append('<button class="btn btn-danger delete"> remove employee </button>');
        }
    });


}

function randomNumber(min, max) {
 randomNum = Math.floor(Math.random() * (1 + max - min) + min);
    console.log(randomNum);
}

//function toggle(){
//    $('#employee-form').slideToggle();
//}
