$(document).ready(function(){
	var checkboxVal = 1;
	var symbolType = "Basic";
	var imagePath = "basic_score_symbols";
	var imHeight = 120;
	//Vars used to position the symbols on the Score
	var xVal;
	var yVal;
	//Added to symbol name to create unique ID for styling
	var uniqueID;
	var continueID;
	//Start button turns into New Score Button
	$(".start_Btn").on("click", function(){
		var $this = $(this);
		$("#the_Score ").children().detach();
		$('#print_Btn').off();
		$this.css("display", "none");
		$this.css("height", "550");
		$this.text("New Score");
		startScore();
	});
	//Start a new score
	function startScore(){
		$("#printed_Score").children().detach();
		startFinish("start").appendTo($("#the_Score"));
		startFinishPrint("start").appendTo($("#printed_Score"));
		$("#start_Object").css("left", "0");
		$("#start_Object").css("bottom", "0");
		$("#finish_Btn").prop("disabled", false);
		//Initialise global variables
		checkboxVal = checkboxVal;
		xVal = 0;
		yVal = 20;
		uniqueID = 0;
		continueID = 0;
		//Add level select listener
		$("#advanced_Checkbox label").on("click", selectLevel);
		//Hide level select disabler
		$('#cover').css('display', 'none');
		//Add print button listener
		$('#print_Btn').on('click', printScore);
	}
	//Add symbol listener
	$("#symbols_and_buttons").on("click", ".symbol", addSymbol);
	//Set the available symbols for the level selected
	function selectLevel(){
		if(checkboxVal === 1){
			imagePath = "advanced_score_symbols";
			imHeight = 100;
			--checkboxVal;
		$("#symbols_and_buttons").off();
		//Show the symbol options
		$("#symbols_and_buttons").on("click", ".symbol", function(){
				$(this).children(".options").slideDown("linear");
		});
		// //Hide the symbol options if none are clicked
		$("#symbols_and_buttons").on("mouseleave", ".symbol", function(){
			$(this).children(".options").slideUp("linear");
		});
		//Add symbol and option listener
		$("#symbols_and_buttons").on("click", ".options p", addSymbol);
		symbolType = "Advanced";

		}else{
			imagePath = "basic_score_symbols";
			imHeight = 120;
			++checkboxVal;
			$("#symbols_and_buttons").off();
			//Add symbol listener
			$("#symbols_and_buttons").on("click", ".symbol", addSymbol);
			symbolType = "Basic";
		}
	}
	//Create the start and finish symbol
	function startFinish(end){
		var EndObj = $("<img>" ,{
		id: end + "_Object",
		src: "images/end_symbols/end.png",
		alt: end,
		height: 20,
		width: 120
		})
		return EndObj;
	}
	//Create the start and finish symbol for print
	function startFinishPrint(end){
		var EndObjPrint = $("<img>" ,{
		class: "printEnd_Object",
		src: "images/printed_symbols/end.png",
		alt: end,
		})
		return EndObjPrint;
	}
	//Create new symbol
	function newSymbol(name){
		var SymbolObj = $("<img>", {
			class: "symbol_Object",
			id: name + ++uniqueID,
			src: "images/" + imagePath + "/" + name + ".jpg",
			height: imHeight,
			width: 120
		})
		//Possible IE8 alternative
		/*
		var SymbolObj = $("<img>"");
               SymbolObj.attr("class", "symbol_Object");
               SymbolObj.attr("id", name + ++uniqueID);
               SymbolObj.attr("src", "images/score_symbols/" + name + ".jpg");
		*/
		return SymbolObj;
	}
	//Create new symbol for print
	function newSymbolPrint(name){
		var ImObjPrint = $("<img>", {
			class: "printIm_Object",
			src: "images/printed_symbols/" + name + ".jpg",
		})
		return ImObjPrint;
	}
	//Create continue symbol
	function continueOn(){
		var continueObj = $("<img>", {
			class: "continue_Object",
			id: "continue" + ++continueID,
			src: "images/end_symbols/continue.png",
			height: 20,
			width: 120
		})
		return continueObj;
	}//Create continue symbol for print
	function continueOnPrint(){
		var ContinueObjPrint = $("<img>", {
			class: "printContinue_Object",
			src: "images/printed_symbols/continue.png",
		})
		return ContinueObjPrint;
	}
	function addSymbol(){
		if(symbolType === "Basic"){
			var thisSymbol = $(this).find(".symbol_Name").text()
						.toLowerCase().replace(/\s+/g, '');
		}else{
			var thisSymbol = $(this).closest(".symbol").find(".symbol_Name").text()
						.toLowerCase().replace(/\s+/g, '');
		}

		newSymbol(thisSymbol).appendTo($("#the_Score"));


		var symbolID = $("#" + thisSymbol + uniqueID);
		symbolID.css("left", xVal);
		symbolID.css("bottom", (yVal));
		if(symbolType === "Advanced"){
			symbolID.before("<p class='symbol_Text'>" + $(this).text() +"</p>");
			$(".symbol_Text").css("color", "#000");
			symbolID.css("bottom", (yVal+20));
		}

		var symbolTextID = symbolID.prev("p");
		symbolTextID.css("left", xVal);
		symbolTextID.css("bottom", yVal);

		yVal += 120;
		//Add the continue symbols when new column is started
		if(xVal > 0 && (uniqueID - 1) % 5 === 0){
			//Add top line
			continueOn().appendTo($("#the_Score"));
			$("#continue" + continueID).css("left", (xVal - 120));
			$("#continue" + continueID).css("bottom", (yVal + 480));
			continueOnPrint().appendTo($("#printed_Score"));
			//Add bottom line
			continueOn().appendTo($("#the_Score"));
			$("#continue" + continueID).css("left", xVal);
			$("#continue" + continueID).css("bottom", (yVal - 140));
			continueOnPrint().appendTo($("#printed_Score"));
		}
		newSymbolPrint(thisSymbol).appendTo($("#printed_Score"));
		if(yVal === 620){
			xVal += 120;
			yVal = 20;
		}
		if(uniqueID === 1){
			$('#cover').css('display', 'block');
		}
		//Force finish if score full
		if(uniqueID === 20){
			$("#symbols_and_buttons").off("click", ".options p");
			xVal = 360;
			yVal = 620;
			finishScore();
		}
	}
	//Finish score button
	$("#finish_Btn").on("click", finishScore);
	//Finish the score and disable appropriate buttons
	function finishScore(){
		if(uniqueID > 0){
			startFinish("finish").appendTo($("#the_Score"));
			if(((uniqueID) % 5) === 0 && uniqueID < 20){
				xVal = xVal - 120;
				yVal = yVal + 600;
			}
			$("#finish_Object").css("left", xVal);
			$("#finish_Object").css("bottom", yVal);
			$("#finish_Btn").prop("disabled", true);
			$(".start_Btn").css("display", "block");
			startFinishPrint("finish").appendTo($("#printed_Score"));
		}
		$("#advanced_Checkbox label").off("click", selectLevel);
	}
});
function printScore(){
	//Check score has been finished
	if($("#printed_Score .printEnd_Object").length === 2){
		window.print();
	}else{
		alert("Please click 'Finish' before printing");
	}
}
