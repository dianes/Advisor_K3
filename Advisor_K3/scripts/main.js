var g_hhAcctListGrpFooter;
var LOCAL = true;
var instId=6083;
var bId=10408149;
var modId = 120;
var args = [];
var data = [];

function ajaxCall(url, param, onSuccess, data, args){
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        data: param,
        datatype: "json",
        success: function(dat){
            data = JSON.parse(dat.d);
            onSuccess(data, args)
        }, 
        error: function(data){
            alert('failure:' + data.status + ':' + data.responseText);
            }        
    });
}


function getContactList(){
    var url = "http://r-sund2/ContactService/Service1.asmx/GetRecentContacts";
    var param = '{InstID:' + instId + ', BrokerID:' + bId + '}'; 
    if(LOCAL){        
        data = JSON.parse(RECENTCONTACT_DATA);
        onGetContactListSuccess(data, args);
    }
    else{    
        ajaxCall(url, param, onGetContactListSuccess, data, args);  
    }
}

function onGetContactListSuccess(data, args){
  //  alert("onGetContactListSuccess");
    $("#contactlist").kendoMobileListView({
			dataSource: data.List,
			template: $("#recentcontact-listview-template").html(),
            style: "inset"            
             
    });          
}


function getHHSnapshot(e){
   // alert("getHHSnapshot");
    var hhId = e.view.params.hhId;
    getHHMembers(hhId);
    getHHAccountList(hhId);  
}


function getHHMembers(hhId){    
    var url = "http://r-sund2/ContactService/Service1.asmx/GetHHMembers";
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', ModuleID:' + modId + ', HHID:' + hhId + '}';  
    ajaxCall(url, param, onGetHHMembersSuccess, data);
}

function onGetHHMembersSuccess(data){
    $("#hhListGrid").empty().kendoGrid({
                     dataSource: data.List,
                     selectable: "multiple cell",                       
                        sortable: true,                 
                     columns: [
                     {
                         field: "name",
                         title: "Name"                         
                     },
                     {    
                         field: "type",
                         title: "Household Relationship"                         
                     }
                 ]
               });  
    
        var output = "";
        $.each(data.List, function(key, val){
            var name = val.name;
            var type = val.type;
            output+='<li>' + name + "    " + type + "</li>";
           // alert("output="+output);                
         });
        
        $('#hhlist').empty().append(output);  
        
    }
    
 function getHHAccountList(hhId){
   //  var hhId=6829146;
    var instId=6083;
    var bId=10408149;
    var modId = 120;
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', ModuleID:' + modId + ', HHID:' + hhId + '}';  
     
     $.ajax({ 
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://r-sund2/ContactService/Service1.asmx/GetHHAccountList",
       // data: "{'InstID': 6083, 'BrokerID': 10408149, 'ModuleID': 120, 'HHID': 6829146}",
        data: param,
        dataType: "json",
        success: function(dat){ 
           // alert("getHHAccountList success");
            var data= JSON.parse(dat.d);
            
            //create datasource
          // var dataSource = new kendo.data.DataSource({data: data.BusinessObjects});
            
         // debugger;  
          //  var raw = dataSource.data();
            var length = data.BusinessObjects.length;
            var intDataSource = [];
            var extDataSource = [];
            var item, i;
            var intIndex = 0;
            var extIndex = 0;
            for(i=0;i<length;i++){
                item = data.BusinessObjects[i];
                if(item.InternalValue == true){
                    intDataSource[intIndex] = item;
                    intIndex++;
                    }
                else{
                    extDataSource[extIndex] = item;
                    extIndex++;
                }
                    
            }
            
          
             $("#intAcctGrid").empty().kendoGrid({
                     dataSource: intDataSource,
                     selectable: "multiple cell",                       
                        sortable: true,                 
                     columns: [
                     {
                         field: "Account_number",
                         title: "Acct.#"                         
                     },
                     {    
                         field: "Owner_name",
                         title: "Owner Name"                         
                     },
                     {
                         field: "Nature_of_acct",
                         title: "Acct.Type"                         
                     }
                 ]
            
                 });
            
            $("#extAcctGrid").empty().kendoGrid({
                     dataSource: extDataSource,
                     selectable: "multiple cell",                       
                        sortable: true,                 
                     columns: [
                     {
                         field: "Account_number",
                         title: "Acct.#"                         
                     },
                     {    
                         field: "Owner_name",
                         title: "Owner Name"                         
                     },
                     {
                         field: "Nature_of_acct",
                         title: "Acct.Type"
                         
                     }
                 ]
            
                 });
        },
        error: function(data){
            alert('getHHAccountList failure:' + data.status + ':' + data.responseText);
            }
        });
 }

//contact search
function searchContactold(){    
    var instId=6083;
    var bId=10408149;
    var searchFor;
    var searchBy;
    var action;
    var url, param;
    var queryStr = "";
    var cInputs = $("input:checked");
    var txtLname = document.getElementById("txtLname").value;
    var txtFname = document.getElementById("txtFname").value;
    var txtCity = document.getElementById("txtCity").value;
    var txtState = document.getElementById("txtState").value;
    var txtZip = document.getElementById("txtCity").value;
     
    $("#contactSearchResultGrid").empty();
    if(cInputs != null){
        for(var pvt=0;pvt<cInputs.length;pvt++){
            if(cInputs[pvt].name=="srchFor"){
                searchFor = cInputs[pvt].value;                
            }
            else if(cInputs[pvt].name =="srchBy"){
                action = cInputs[pvt].value;
                if(action == "srchByDemo"){
                    queryStr = "<firstname>" + txtFname + "</firstname>";
                    queryStr += "<lastname>" + txtLname + "</lastname>";
                    queryStr += "<city>" + txtCity + "</city>";
                    queryStr += "<state>" + txtState + "</state>";
                    queryStr += "<zip>" + txtZip + "</zip>";

                    param = '{InstID:' + instId + ', BrokerID:' + bId + ', SearchFor:"' + searchFor + 
                        '", SearchQRY:"' + queryStr + '", page: 1, itemCount: 25, sortColumn: "Name", isAscending: true' +  '}'; 
                    url = "http://r-sund2/ContactService/Service1.asmx/SearchByDemographic"; 
                }
                else if(action == "srchByAcctno"){                    
                }
                
                
            }
        }
        
        $.ajax({ 
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,       
        data: param,
        dataType: "json",
        success: function(dat){
            $("#tblDiv .k-grid-header").remove();         
            var data= JSON.parse(dat.d);
        
            $("#contactSearchResultGrid").kendoGrid({
                        dataSource: data.List,
                       // pageable: true,
                        selectable: "multiple cell",
                        sortable: true,
                        columns: [
                     {
                         field: "lname",
                         title: "Name"                         
                     },
                     {    
                         field: "type",
                         title: "Type"                         
                     },
                     {
                         field: "acct_no",
                         title: "Acct.#"                         
                     },
                      {
                         field: "phone",
                         title: "Phone"                         
                     },
                     {
                         field: "city",
                         title: "City"                         
                     },
                    {
                         field: "state",
                         title: "State"                         
                     },
                     {
                         field: "zip",
                         title: "Zip"                         
                     }, 
                    {
                         
                         title: "Action"                         
                     },
                 ],
                        rowTemplate: kendo.template($("#contactSearchResultRowTemplate").html()),
                        
                        
                    }).show();
          
            },
        error: function(data){
            alert('searchResult failure:' + data.status + ':' + data.responseText);
            }
        });     
    } 
}

function initContactSearch(){
    var lastnameDataSource = ["Sm",
                        "Sma",
                        "Smith",
                        "Smoke",
                        "Smz",
                        "A",
                        "AD",
                        "ADV",
                        "Ad",
                        "ad",
                        "ada",
                        "Adv"
    ];
    
    $("#txtLname").kendoAutoComplete({
        dataSource: lastnameDataSource,
        filter: "startswith",
        placeholder: "Last Name",
        width: "80%",
        select: function(e){
            var item = e.item;
            var text = item.text();           
            searchContactByText(text);
        }
       
    }).css("width","").removeClass("k-input").parent().removeClass();
}

function autocompleteKeypressed(e){    
    if(e.keyCode == 13)
        searchContact();
}

function clearText(e){
   // alert("e.value="+e.value);
    e.value = "";
}

function searchContact(){
  //  alert("searchContact");
    var txtLname= document.getElementById("txtLname").value;   
    searchContactByText(txtLname);
}

function searchContactByText(txtLname){
  // alert("searchContactByText");
    var searchFor="client"   
    var url, param;
    var queryStr = "";   
   
    $("#contactSearchResultGrid").empty();
    
      queryStr="<firstname></firstname><lastname>" + txtLname + "</lastname><city></city><state></state><zip></zip>";  
      param = '{InstID:' + instId + ', BrokerID:' + bId + ', SearchFor:"' + searchFor + 
                        '", SearchQRY:"' + queryStr + '", page: 1, itemCount: 25, sortColumn: "Name", isAscending: true' +  '}'; 
      url = "http://r-sund2/ContactService/Service1.asmx/SearchByDemographic"; 
     
      if(LOCAL){          
          data = JSON.parse(CONTACTSEARCH_SMITH_DATA);
          onContactSearchSuccess(data, args);
      }
      else{
          ajaxCall(url, param, onContactSearchSuccess, data, args);
      }
}

function onContactSearchSuccess(data, args){
  //  alert("onContactSearchSuccess");
 
    $("#tblDiv .k-grid-header").remove(); 
    $("#contactsearchlist").kendoMobileListView({
			dataSource: data.List,
			template: $("#contactsearch-listview-template").html(),
            style: "inset" 
		}).show();          
}
        

function getHHProfile(e){
    var hhId = e.view.params.hhId;
    getAccountsInfo(hhId);
    getContactsInfo(hhId);
    
}


function getContactsInfo(hhId){     
  //  alert("getContactsInfo");
    $("#hhProfileListGrid").empty();
     
    var param = '{InstID:' + instId + ', BrokerID:' + bId + ', propId: 0, partyId:' + hhId + '}';  
    var url = "http://r-sund2/ContactService/Service1.asmx/GetContactDetails";   
    if(LOCAL){        
        data = JSON.parse(CONTACTDETAIL_DATA);
        OnGetContactsInfoSuccess(data, args);
    }else{        
        ajaxCall(url, param, OnGetContactsInfoSuccess, data, args);
    }
}

function OnGetContactsInfoSuccess(data, args){
    var scriptTemplate = kendo.template($("#newcontactDetailTemplate").html());               
    $("#hhProfileListGrid").html(scriptTemplate(data.List[0]));            
}
        



function getAccountsInfo(hhId){
    $("#hhAccountInfo").empty();
    var param = '{planId: 0, householdId:' + hhId + '}'; 
    var url = "http://r-sund2/ContactService/Service1.asmx/GetAccountHHSnapshot";    
    args[0] = hhId;
    if(LOCAL){
        data = JSON.parse(ACCOUNTHHSNAPHOT_DATA);
        onGetAccountsInfoSuccess(data, args);
    }else{
        ajaxCall(url, param, onGetAccountsInfoSuccess, data, args);
    }
 }

function onGetAccountsInfoSuccess(data, args)
{
  //  alert("onGetAccountsInfoSuccess");
    
    
    var hhId = args[0];
  //  alert("hhId="+ hhId);
    $("#hhAccountInfo").kendoGrid({
                    dataSource: {data: data.HHAcctInfoList.List,
                         group: {
                             field:"InternalValue", 
                             dir:"desc",
                             aggregates:[
                                     { field:"MarketValue",aggregate:"sum"}
                             ]
                         }
                    },                                
                    columns: [
                        {
                            field: "AccountNumber",
                            title: "ACCT.#",                         
                           // template: "<a href='\#accountDetailView?acctId=${AccountNumber}&householdId=" + hhId + "'>${AccountNumber}</a>"
                           // template: "<a href='javascript:gotoAccountDetal(\"${AccountId}\"," + hhId + ")'>${AccountNumber}</a>"
                            template: "<div style='color:\\#7AADDE;font-weight:bold'><a href='javascript:gotoAccountDetal(\"${AccountId}\"," + hhId + ")' style='text-decoration:none'>${AccountNumber}</a></div>"
                        },
                      /*  {
                            field: "AccountName",
                            title: "ACCOUNT NAME"
                        },*/
                      /*  {
                            field: "OwnerName",
                            title: "Owner"
                        },*/
                        {
                            field: "NatureOfAccount",
                            title: "ACCT. TYPE",
                            template: "<div style='font-weight:normal'>#:NatureOfAccount#</div>",
                            groupFooterTemplate:"#= g_hhAcctListGrpFooter #",
                            footerTemplate: "Total Value:"
                        },
                       /* {
                            field: "DiscretionaryType", values: [{text: "Non-Discretionary", value: "n"},
                                                                 {text: "Discretionary", value:"y"}],
                            title: "Discretion"                           
                        },*/
                       /* {
                            field: "ProgramName",
                            title: "Product Class",
                            groupFooterTemplate:"#= g_hhAcctListGrpFooter #",
                            footerTemplate: "Total Value:"
                        },*/
                        {
                            field: "MarketValue",
                            title: "MV*",
                            template: "<div style='font-weight:normal'>#=kendo.toString(MarketValue, 'c') #</div>",
                            groupFooterTemplate: "<div style='font-size:1.3em;color:blue'>#= kendo.toString(sum,'c') #</div>",
                            footerTemplate:"<div style='font-size:1.8em;color:green'>#= getTotal() # </div>",
                            format: "{0:c}"
                        },
                       /* {
                            field: "RebalanceStatus",
                            title: "Rebal Status"
                        }, 
                        {
                            title: "Actions"
                        },*/
                        {
                            hidden: true, 
                            field: "InternalValue",
                            groupHeaderTemplate: "#= getGroupHeader(value) #"                          
                        }                   
                    ],
                });
}

function getGroupHeader(value){ 
    /*******************************************************************************************
      groupFooterTemplate doesn't contain info about "group by" field and value. 
      As a workaround, suggested by Telerik team, retrieve this info through groupHeaderTemplate
      (groupHeaderTemplate is executed before groupFooterTemplate).  
      Note here g_hhAcctListGrpFooter is a global variable 
    ********************************************************************************************/
    if(value=="Y"){
        g_hhAcctListGrpFooter = "Internal Total:";
        return "Internal Accounts";        
    }
    else{
        g_hhAcctListGrpFooter = "External Total:";
        return "External Accounts";
    }
}



function getTotal(){    
    var dataSource = $("#hhAccountInfo").data("kendoGrid").dataSource;
    var result = 0;

    //loops through dataSource view
    $(dataSource.view()).each(function(index,element){
        result += element.aggregates.MarketValue.sum;
    });
    return kendo.toString(result, 'C');
}

function contactnameclick(hhid){
  //  alert("contactnameclick=" + hhid);
    //document.location.href="#hhSnapshotView?hhId=" + hhid;
    
    //document.location.href="views/hhProfileView.html?hhId=" + hhid;
    document.location.href="#hhProfileView?hhId=" + hhid;
    return true;
}

function contactdetailclick(hhid){
 //   alert("contactdetailclick=" + hhid);
    document.location.href="#hhProfileView?hhId=" + hhid;
    return true;
}

function gotoAccountDetal(acctNum, hhId){
 //   alert("gotoAccountDetal");
    document.location.href="#accountDetailView?acctId=" + acctNum + "&householdId=" + hhId;
}

function initScrollView(e) { 
        e.view.element.find("#scrollView").kendoMobileScrollView(); 
}


function getAcctDetail(e)
{
    var acctId = e.view.params.acctId;
    var hhId = e.view.params.householdId;
  
 //  alert("getAccountDetail");
    
    $("#accountDetailInfo").empty();
    $("#holdingsInfo").empty();
    $("#chart").empty();
    $("#assetsTable").empty();    
 
    var param = '{acctId:"' + acctId + '", householdId:' + hhId + ', planId: 0, partyId:0, partyType: "Household", acViewId: -1}';    
    var url = "http://r-sund2/ContactService/Service1.asmx/GetAccountSnapshot";
    if(LOCAL){        
        data = JSON.parse(ACCOUNTSNAPSHOT_DATA);
        onGetAcctDetailSuccess(data, args);
    }else{
        ajaxCall(url, param, onGetAcctDetailSuccess, data, args);}
    }
    

function onGetAcctDetailSuccess(data, args)
{
    var scriptTemplate = kendo.template($("#accountDetailInfoTemplate").html());
    $("#accountDetailInfo").html(scriptTemplate(data.AcctPositionMemento));
            
    bindHoldingsInfo(data.AcctPositionMemento);
            
    createChart(data.SecClassificationCollection.List);
    assetsTable(data.SecClassificationCollection.List);
}

/*var data = [
                    {
                        "source": "Hydro",
                        "percentage": 22,
                        "explode": true
                    },
                    {
                        "source": "Solar",
                        "percentage": 2
                    },
                    {
                        "source": "Nuclear",
                        "percentage": 49
                    },
                    {
                        "source": "Wind",
                        "percentage": 27
                    }
                ];

                function createChartsample(list) {
                    
                    alert("sample chart");
                    $("#chart").kendoChart({
                        title: {
                            text: "Break-up of Spain Electricity Production for 2008"
                        },
                        legend: {
                            position: "bottom"
                        },
                        dataSource: {
                            data: data
                        },
                        series: [{
                            type: "pie",
                            field: "percentage",
                            categoryField: "source",
                            explodeField: "explode"
                        }],
                        seriesColors: ["#42a7ff", "#666666", "#999999", "#cccccc"],
                        tooltip: {
                            visible: true,
                            template: "${ category } - ${ value }%"
                        }
                    });
                }
*/

function createChart(list){
 //   alert("createChart");

    var dataArray = [];
    var colorArray=[];
   
    for(var i=0; i<list.length; i++){
        dataArray[i]=list[i].secACList[0];      
        colorArray[i]="rgb(" + list[i].secACList[0].red + "," + list[i].secACList[0].green + "," + list[i].secACList[0].blue + ")";
       // alert("colorArray="+ colorArray[i]);
    }
    
   // alert("dataArray=" + dataArray);    
   
    
    $("#chart").kendoChart({
        dataSource: {data: dataArray},
        /*title: {
                    position:"bottom",
                    text: "Assets Allocation"
            },*/
        legend: {
                    visible: false
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
          /*  labels: {
                visible: true,
                background: "transparent",
                template: "${category}(${value}%)"
            }*/
        },
        series:[{
                type: "pie",
                startAngle: 150,
                field: "pct",
                categoryField: "name"                
            
        }],
        seriesColors: colorArray,
        tooltip: {
            visible: true,
            format: "{0}%"
        },
        drag: onDrag,
        zoom: onZoom,
        plotAreaClick: onPlotAreaClick,
       // seriesClick: onSeriesClick,
       // seriesHover: onSeriesHover
        
    });
}

function onDrag(e)
{
 //alert("onDrag");
}

function onZoom(e)
{
    //alert("onZoom");
}

function onPlotAreaClick(e)
{
    //alert("onPlotAreaClick");
}

function onSeriesClick(e)
{
   // alert("onSeriesClick, clicked value:"+ e.value);
}

function onSeriesHover(e)
{
    //alert("onSeriesHover");
}

function assetsTable(list)
{
  //  alert("assetsTable");
    var dataArray = [];
    for(var i=0; i<list.length; i++){
        dataArray[i] = list[i].secACList[0];
        dataArray[i].color = "rgb(" + list[i].secACList[0].red + "," + list[i].secACList[0].green + "," + list[i].secACList[0].blue + ")";
    }
   // debugger;
    
     
    
    $("#assetsTable").kendoGrid({
                        dataSource: dataArray,
                        rowTemplate: kendo.template($("#assetsTemplate").html()),        
                       columns: [
                      { field: "color",
                        title: " ",
                        width: "10%",                        
                        attributes:{
                            style: "background-color:#:color#;width:5%",
                       // template: " "
                            
                        } 
                      },
                     {
                         field: "name",
                         title: "Asset",
                         headerAttributes:{
                             style: "text-align:left"
                         },
                         width: "70%"
                     },
                     {    
                         field: "pct",
                         title: "%",
                         headerAttributes:{
                             style: "text-align:right"
                         }
                     }
                 ]
                        
                    });
    
    
}

function bindHoldingsInfo(data)
{
   
   // alert("getHoldingsInfo");
    var dataArray = [];
    
    for(var i=0; i<data.BusinessObjects.length; i++)
    {
        dataArray[i] = data.BusinessObjects[i].Security_Detail;
        dataArray[i].Qty = data.BusinessObjects[i].Qty;
        dataArray[i].Current_price = data.BusinessObjects[i].Current_price;
        dataArray[i].Market_value = data.BusinessObjects[i].Market_value;      
    }
    
    //alert("bindHoldingsInfo dataArray="+ dataArray);
    
    $("#holdingsInfo").kendoGrid({
                                dataSource: {data: dataArray                               
                    },                                
                    columns: [
                       /* {
                            field: "Sec_name",
                            title: "Name (Symbol)",   
                            template:"<div style='color:\\#003F6B'>#:Sec_name# (#:Sec_symbol#)</div>",
                            width: "350px"
                            
                        }, */  
                        {
                            field: "Sec_symbol",
                            title: "Symbol"   ,
                            
                            template: "<div title='#=Sec_name#' style='color:\\#7AADDE'>#:Sec_symbol#</div>"                     
                           
                          
                        },
                       {    
                            field: "Current_price",
                            title: "Current Price",
                            template: "<div style='font-weight:normal'>#=kendo.toString(Current_price,'c')#</div>"
                            
                        },
                     
                        {
                            field:"Sec_type",
                            title: "Sec Type",
                            template: "<div style='font-weight:normal'>#:Sec_type#</div>"
                        },
                        {
                            field: "Qty",
                            title: "Quantity",
                            template: "<div style='font-weight:normal'>#:Qty#</div>"
                        },
                        {
                            field: "Market_value",
                            title: "Market Value",
                         //   format: "{0:c}",
                            template: "<div style='font-weight:normal'>#=kendo.toString(Market_value,'c')#</div>"
                        }
        
                     
                       
                    ],
                });
}

     