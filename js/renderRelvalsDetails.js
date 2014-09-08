//------------------------------------------------------------------------------
// RelVals Results
// ------------------------------------------------------------------------------

/**
 * generates the function for a given arch and a given Ib to take into account the different ids for each case
 */
genAddSummaryRow = function( genArch , genIB ){

  /**
   * Adds a row with the summary of the results
  */
  return function( table , statistics ){

    var row = $( '<tr>' )
    row.append( $( '<td>' ) )

    var showSummaryLink = getLinkWithGlyph( '#' + genArch + ';' + genIB , 'Show summary' , 'glyphicon-chevron-right' , 'toggleSummaryLink'+ '-' + genArch + '-' + genIB )

    showSummaryLink.click( genToggleSummaryTables( genArch , genIB ) )

    var labelsTable = $( '<table>' ).attr( 'id' , 'summarylabelsTable' +'-' + genArch ).attr( 'align' ,'right' ) 
    labelsTable.append( $( '<tr>' ).append( $( '<td>' ).text( 'Passed:' ) ) )
    labelsTable.append( $( '<tr>' ).append( $( '<td>' ).text( 'Failed:' ) ) )
    labelsTable.append( $( '<tr>' ).append( $( '<td>' ).text( 'Not run:' ) ) )
    labelsTable.append( $( '<tr>' ).append( $( '<td>' ).text( 'Total:' ) ) )

    var linkTable = $( '<table>' ).attr( 'align' ,'right' )
    var linkTableRow = $( '<tr>' )
    linkTableRow.append( $( '<td>' ).append( showSummaryLink ).attr( 'style' ,'text-align: right;' ) )
    linkTableRow.append( $( '<td>' ).append( labelsTable ).attr( 'align' ,'right' ) )
    linkTable.append( linkTableRow ) 
    labelsTable.hide() 
  
    row.append( $( '<td>' ).append( linkTable ) )

    for( var i = 0; i < MAX_STEPS; i++ ){

      var summaryTable = $( '<table>' ).attr( 'id' , 'summaryStep' +( i+1 ) +'-' + genArch + '-' + genIB ).attr( 'align' ,'left' )
      for ( key in statistics[ i ] ){

        var summaryRow = $( '<tr>' )
        var statTitle = key.charAt( 0 ) + key.slice( 1 ).toLowerCase() + ': ' 
        var valueCell = $( '<td>' ).append( $( '<small>' ).text( statistics[ i ][ key ] ) ).attr( 'align' ,'right' )

        summaryRow.append( valueCell )
        summaryTable.append( summaryRow )

      }

      row.append( $( '<td>' ).append( summaryTable ) )

      summaryTable.hide()
    }
  
    table.prepend( row )

  }

}

/**
 * Generates the function with the given arch and given IB to take them into account in the id and url
 */
genAddShowAllRowLink = function( genArch, genIB ){

  /**
   * Adds to the workflows table a row which has a link which toggles the workflows after the 20th
   */
  addShowAllRowLink = function( table , startRow , endRow ){

    var row = $( '<tr>' )
    var linkCell = $( '<td>' ).attr( 'colspan' , 7 )
    var showAllLink = getLinkWithGlyph( '#' + genArch + ';' + genIB  , 'Show All' , 'glyphicon-chevron-right' , 'showAllLink'+ '-' + genArch + '-' + genIB )

    showAllLink.click( genToggleHiddenRows( genArch, genIB , startRow , endRow ) )


    linkCell.append( showAllLink )
    row.append( linkCell )
    table.append( row )

  }

  return addShowAllRowLink

}
/**
 * returns the link address for a given Ib and an arch
 */
getlinkAddress = function( arch , ib , step , workflowName , workflowID ){

  var filename = ''
  filename = 'step' + ( parseInt( step ) + 1 ) + '_' + workflowName + '.log'
  
   
  var address = 'http://cmssdt.cern.ch/SDT/cgi-bin/buildlogs/' + arch + '/' + ib + '/pyRelValMatrixLogs/run/' + workflowID + '_' + workflowName + '/' + filename

  return address;

}

/**
 * returns a link to the result log of the relval with the label given as a parameter
 */
getLinkLabelToResultToResLabel = function( arch , ib , stepNumber , workflowName , workflowId , text ){
 
  var linkAddress = getlinkAddress( arch , ib , stepNumber , workflowName , workflowId )
  var link = $( "<a>" ).attr( "href" , linkAddress ) 
  link.attr( 'style' , 'color:black' )
  link.append( $( '<small>' ).text( text ) )

  return link

}

/**
 * creates the cell of the table that describes the workflow name
 * and adds the commands for each step. they are hidden by default
 */
fillWorkflowCell = function( cell , workflowID , workflowShortName , numToShow , arch , ib ){

  cell.append( $( '<span>' ).text( workflowID + ' ' +  workflowShortName + '  ' ) )

    
  var link = $( "<a>" ).attr( "href" , '#' + arch  + ';' + ib )
  link.attr( 'showCMD' , 'cmd-div-' + arch + '-' + workflowID + ';' + numToShow )
 // link.attr( 'style' , 'color:black' ) 

  link.append( $( '<small>' ).append( $( '<small>' ).append( $( '<span>').attr( 'class' , 'glyphicon glyphicon-chevron-right' )  )  ) )
  link.append( $( '<small>' ).text( 'cmd' ) )
  cell.append( link )

  cell.append( $( '<br>' ) )
  
  var commandsDiv = $( '<div>' ).attr( 'id' , 'cmd-div-' + arch + '-' + workflowID.replace( '.' , '-' ) )


  // this atribube indicates if the div has been shown, to avoid filling it again with the commands
  // each time the user clicks
  commandsDiv.attr( 'wasShown' , 'no' )


 
  link.click( toggleCommands2 )
  commandsDiv.hide()

  cell.append( commandsDiv )

}
/**
 * Adds a row to the workflow with the relval result info, it also modifies the statistics
 * as they are until the moment that te workflow is read.
 * The statistics is a array of dictionaries, each position has a dictionary with the entries
 * "passed" , "failed" and "notrun" with the numbers for the step
 */
addWorkflowRow = function( workflowResult , table , counter , statistics , arch , ib , totalRows ) {

  var row = $( '<tr>' ).attr( 'id' , 'row' + counter + '-' + arch )

  row.append( $( '<td>' ).append( $( '<b>'  ).text( counter ) ) )

  var workflowCell = $( '<td>' )

  row.append( workflowCell )

  // this is to fill all the rows with cells
  var numCells = 0;
  var numToShow = 0

  var nothingRun = true;
  for ( var stepNumber in workflowResult.steps ){

    var text = workflowResult.steps[ stepNumber ][ 'status' ]
    var errors = workflowResult.steps[ stepNumber ][ 'errors' ]
    var warnings = workflowResult.steps[ stepNumber ][ 'warnings' ]

    var resLabel = $( '<span>' )
    resLabel.append( $( '<samp>' ).text( LABELS_TEXT[ text ]) )

    if( text == 'PASSED' ){

      
      numToShow++;

      nothingRun = false;
      if ( errors > 0 ){

        resLabel.attr( 'class' , 'label').attr( 'style' , 'background-color:' + PASSED_ERRORS_COLOR )

      }else if ( warnings > 0 ){

        resLabel.attr( 'class' , 'label' ).attr( 'style' , 'background-color:' + PASSED_WARNINGS_COLOR )

      }else{

        resLabel.attr( 'class' , 'label' ).attr( 'style' , 'background-color:' + PASSED_COLOR )

      }

      var link = getLinkLabelToResultToResLabel( arch , ib , stepNumber , workflowResult.name , workflowResult.id , '' )
      link.append( resLabel )
      var cell = $( '<td>' ).append( link )

      row.append( cell )


    }else if( text == 'FAILED' ){

      numToShow++;

      nothingRun = false;
      resLabel.attr( 'class' , 'label label-danger')
      row.attr( 'class' , 'danger' )

      var link = getLinkLabelToResultToResLabel( arch , ib , stepNumber , workflowResult.name , workflowResult.id , '' )
      link.append( resLabel )
      var cell = $( '<td>' ).append( link )
      row.append( cell )

      resLabel.attr( 'class' , 'label' ).attr( 'style' , 'background-color:' + FAILED_COLOR  )

     



    }else if( text == 'NOTRUN' ){

      resLabel.attr( 'class' , 'label' ).attr( 'style' , 'background-color:' + NOT_RUN_COLOR )
      row.append( $( '<td>' ).append( resLabel ) )

    }else {

      resLabel.attr( 'class' , 'label label-default')
      row.append( $( '<td>' ).append( resLabel ) )

    }

    // by default steps until step 5 are in the dictionary, If there are more steps I add them
    if( stepNumber >= MAX_STEPS )
    {
      MAX_STEPS = parseInt( stepNumber ) + 1
      var resultsDict = {
        "PASSED" : 0,
        "FAILED" : 0,
        "NOTRUN" : 0,
        "TOTAL"  : 0
      }
      console.log( 'Modifying MAX_STEPS' )
      console.log( MAX_STEPS )
      if ( MAX_STEPS == 51 ){
        console.log( workflowResult.id )
      }
      statistics[ stepNumber ] = resultsDict
      statistics[ stepNumber ][ text ]++

    }else{

      statistics[ stepNumber ][ text ]++

    }
    
    // when it is not run it doesn't count in the total
    if( text != 'NOTRUN' ){
      statistics[ stepNumber ][ "TOTAL" ]++;
    }


    numCells++;
  }

  // if no step was run I don't add it
  if ( nothingRun ){
    return true;
  }

 
  // I add the contents here after the number of workflows to show has been caculated
  fillWorkflowCell( workflowCell , workflowResult.id , workflowResult.name.split( '+' )[0] , numToShow , arch , ib )


  // fill the missing cells to have 5 in total
  for ( var numEmpty = 0; numEmpty < DEFAULT_STEPS-numCells; numEmpty++ ){
    row.append( $( '<td>' ) )
  }

  // only shows the first 20 rows, the other ones are hidden and to be toggled
  if ( counter > 20 ){
    row.hide()
  }
  table.append( row )

   if ( counter == 20 ){

    addShowAllRowLink = genAddShowAllRowLink( arch , ib )
    addShowAllRowLink( table , 20 , totalRows )
  }

  return false;
        
}

/**
 * Adds to the table with relvals results
 */
addRowsTable = function( results , arch , ib , table , progressBar ){

  table.attr( 'class' , 'table table-striped table-condensed' )
  table.attr( 'id' , 'resultsTable-' + arch + '-' + ib ) 


  var resultsSummary = []
  for( var i = 0; i < MAX_STEPS ; i++ ){
    var resultsDict = {
      "PASSED" : 0,
      "FAILED" : 0,
      "NOTRUN" : 0,
      "TOTAL"  : 0
    }
    resultsSummary[i] = resultsDict
  }

  // this is the file name to check for the comands                      

  var releaseQueue = ib.substring( 0 , ib.lastIndexOf( "_" ) )
  var ibDate = ib.substring( ib.lastIndexOf( "_" ) + 1 , ib.length )
 

  var counter = 1;
  for ( var key in results ){
    // nothingRun is to know if no step was run in the workflow
    nothingRun = addWorkflowRow( results[ key ] , table , counter , resultsSummary , arch , ib , results.length )

    // it won't reach 100 because I don't count the ones that have no steps run
    var percentage = ( ( counter / results.length ) * 50 ) + 50

    setProgressBar( progressBar , percentage )
    if ( !nothingRun ){
      counter++;
    }
  }

  addSummaryRow = genAddSummaryRow( arch , ib ) 
  addSummaryRow( table , resultsSummary )

  addHeaderToTable( table )
  setProgressBar( progressBar , 100 ) 

}

/**
 * Adds the header to the relvals table
 */
addHeaderToTable = function ( table ) {

  var workflowNumber = $( '<th>' ).text( "#" )
  var workflowTitle = $( '<th>' ).text( "Workflow" )
  var headRow = $( '<tr>' )
  
  headRow.append( workflowNumber )
  headRow.append( workflowTitle )

  for ( var i = 0; i < MAX_STEPS ; i++){

    var stepTitle = $( '<th>' ).text( "Step " + (i+1) )
    headRow.append( stepTitle )

  }

  var header = $( '<thead>' )
  header.append( headRow )
  table.append( header )                  

}

//-------------------------------------------------------------------------------
// Tabs
// ------------------------------------------------------------------------------

/**
 * generates a function to show the tab with the id given as a parameter
 */
genShowTab = function( tabLink ){

  /**
   * shows the tab with the id given as a parameter
   **/
  showTab = function( e ){
    e.preventDefault( )
    tabLink.tab('show')
  }

  return showTab

}


/**
 * Creates the navtabs with based on the archsList the ibName is for creating the link
 */
getNavTabs = function( archsList , ibName ){

  var tabList = $( '<ul>' ).attr( 'class', 'nav nav-tabs').attr( 'role' , 'tablist')

  var oneSelected = false;
  for( var i = 0; i < archsList.length ; i ++){

    var item = $( '<li>' )
    var archName = archsList[ i ]

    // if the it is the requested arch it is active
    if( archName == ORIGINAL_ARCH ){
      item.attr( 'class' , 'active' )
      oneSelected = true
      CURRENT_ARCH = archName
    }

    // if none of them is requested the last one is the onq which becomes active
    if ( i == archsList.length -1 && !oneSelected ){
      item.attr( 'class' , 'active' )
      CURRENT_ARCH = archName
    }


    var tabLink = $( '<a>' ).attr( 'href' , '#' + archName + '-tab' )
    
    //var itemID = archName + '-' + ibName + '-tabLiItem'
   // item.attr( 'id' , itemID )
   // var tabID = archName + '-' + ibName + '-tab'
    tabLink.click( genShowTab( tabLink ) )

    tabLink.text( archName )
    
    item.append( tabLink )
    tabList.append( item )
  }

  


  return tabList
}

/**
 * It generates a function that 
 * Reads the results of one file, gets the table, and appends it to the tab pane
 */
generateAddResultsTableToPane = function( tabPaneID , arch , ibName , progressBar , progressDiv ){


  return function( results ){

    console.log ( 'modifying' )
    console.log ( tabPaneID ) 
    setProgressBar( progressBar , 50 )

    startDate = new Date()
    console.log( 'start: ' + startDate )
    var table = $( '<table>' )
    $( '#' + tabPaneID ).append( table )
    addRowsTable( results , arch , ibName , table , progressBar )

    progressDiv.hide( 100 )

    endDate = new Date()
    console.log( 'end: ' + endDate )

    console.log( endDate - startDate )

    
  }

}



/**
 * Creates the tab panes based on the archsList and the IBName
 */
fillTabPanes = function( tabContent , archsList , ibName ){



  for( var i = 0; i < archsList.length ; i++){

    var tabPaneClass = 'tab-pane'
    var arch = archsList[ i ]

    if ( arch == CURRENT_ARCH ){
      tabPaneClass += ' active'
    }
   
    var tabPaneID = arch + '-tab' 
    var tabPane = $( '<div>' ).attr( 'class' , tabPaneClass ).attr( 'id' , tabPaneID )

    var divLinkPrevVersion = $( '<div>' ).attr( 'align' , 'center' )
    var addressPrevVersion = getAddresstoPrevVersion( arch, ibName )
    linkToPrevVersion = getLinkWithGlyph( addressPrevVersion , ' Click here to see the previous version' , 'glyphicon-warning-sign' , '' )
    divLinkPrevVersion.append( linkToPrevVersion )

    tabPane.append( $( '<br>' ) )
    tabPane.append( divLinkPrevVersion ) 
    tabPane.append( $( '<br>' ) )
   
    var ibDate = ibName.substring( ibName.lastIndexOf( "_" ) + 1 , ibName.length ) 
    var releaseQueue = ibName.substring( 0 , ibName.lastIndexOf( "_" ) )
    var jsonFilePath = 'data/relvals/' + arch + '/' + ibDate + '/' + releaseQueue +'.json';

    var progressDiv = $( '<div>' ).attr( 'class' , 'progress' )
    var progressBar = $( '<div>' ).attr( 'class' , 'progress-bar progress-bar-striped active' ).attr( 'role' , 'progressbar' )
                                  .attr( 'aria-valuenow' , '0' ) .attr( 'aria-valuemin' , '0' )
                                  .attr( 'aria-valuemax' , '100' ).attr( 'style' , 'width: 30%;' )
                                  .text( 'loading...' )

    progressDiv.append( progressBar )
    tabPane.append( progressDiv )   

    tabContent.append( tabPane )
    var addResultsTableToPane = generateAddResultsTableToPane( tabPaneID , arch , ibName , progressBar , progressDiv )

    console.log( 'Reading: ' )
    console.log( jsonFilePath )
    $.getJSON( jsonFilePath , addResultsTableToPane )

    console.log( 'Finished Reading: ' )

  }



}

/**
 * generates the function for the text field 
 */
genAddCommandToDiv = function( cmdTextSmall ){

  /**
   * appends the command to the text field
   */
  addCommandToDiv = function( commandInfo ){

    var command = commandInfo[ 'command' ] 
    cmdTextSmall.append( $( '<samp>' ).text( command ) ) 

  }
  return addCommandToDiv

}

/**
 * Generates the function that gets the hash for the command to then add it to the div by another function
 */
genGetHashCommandsToDiv = function( workflowID , steps , commandsDiv ){

  console.log( 'Generating' )
  console.log( 'genGetHashCommandsToDiv' )
  console.log( 'total steps: ' + steps )

  /**
   * the goal here is to get the hash for each command to then pass it to the next function
   */
  getHashCommandsToDiv = function( hashesCommands ){

    console.log( 'reading data' )
    console.log( 'total steps: ' + steps )

    for ( var i = 1; i <= steps ; i++ ){

      var stepNumberSM = $( '<small>' ).text( 'step' + i  + ':' )
      commandsDiv.append( $( '<strong>' ).append( stepNumberSM )  )
      console.log( i )
      var index = workflowID + '-' + i
      var hashCommand = hashesCommands[ index ]

      console.log( workflowID )
      console.log( 'this is the hash for step ' + i )
      console.log( hashCommand )

      if ( hashCommand != null ){

        var commandInfoFile = 'data/commands/objs/' + hashCommand.charAt( 0 ) + '/' + hashCommand.substring( 1 , hashCommand.length )
        console.log( commandInfoFile )
     
        var cmdTextSmall = $( '<small>' )
        commandsDiv.append( cmdTextSmall )
        commandsDiv.append( $( '<br>' ) )

        var addCommandToDiv = genAddCommandToDiv( cmdTextSmall )
        $.getJSON( commandInfoFile , addCommandToDiv )

      }else {

        commandsDiv.append( $( '<small>' ).text( 'N/A' ) )
        commandsDiv.append( $( '<br>' ) ) 

      }

    }  


  }

  return getHashCommandsToDiv

}

//-------------------------------------------------------------------------------
// Header
// ------------------------------------------------------------------------------

/**
 * generates a link to the previous version of the page
 */
getAddresstoPrevVersion = function( arch, ibName ){

  var ibNameParts = ibName.split( '_' )
  var rel = ibNameParts[ 1 ] + '.' + ibNameParts[ 2 ]
  var dateParts = ibNameParts[ ibNameParts.length - 1 ].split( '-' )
  var time = dateParts[ 3 ].replace( '00' , '' )

  var tempDate = new Date( dateParts[ 0 ] , dateParts[ 1 ] - 1 , dateParts[ 2 ] )

  var weekDay = ['sun','mon','tue','wed','thu','fri','sat'][ tempDate.getDay() ]

  console.log( 'Date :' + weekDay )
  console.log( tempDate )
  console.log( dateParts[ 1 ] )



  var dayTimeRel = rel + '-' + weekDay + '-' + time


  var link = 'https://cmssdt.cern.ch/SDT/cgi-bin//showMatrixTestLogs.py/' + arch +'/www/' + weekDay + '/' + dayTimeRel + '/' + ibName + '/pyRelValMatrixLogs/run'

  return link

}

/**
 * adds to the rwo a cell with the label and the legend
 */
addLegendCell = function( row , color , itemText , description ){

  var labelCell = $( '<td>' ).attr( 'style' , 'border: none;' )
  var descCell = $( '<td>' ).attr( 'style' , 'border: none;' )
  var label = $( '<span>' ).attr( 'style' , 'background-color:' + color ).attr( 'class' , 'label' )
  label.append( $( '<samp>' ).text( itemText ) )


  labelCell.append( label )
  descCell.append( $( '<span>' ).text( description ) )

  row.append( labelCell )
  row.append( descCell )


}


/**
 * creates the list that shows the legend for the results
 */
getLegendTable = function( ){

  var table = $( '<table>' ).attr( 'class' , 'table table-condensed' ).attr( 'style' , 'border: none;' )

  var row1 = $( '<tr>' )
  addLegendCell( row1 , PASSED_COLOR , LABELS_TEXT[ 'PASSED' ] , 'Passed without error or warning messages' )
  addLegendCell( row1 , PASSED_ERRORS_COLOR , LABELS_TEXT[ 'PASSED' ] , 'Passed with error messages' )
  addLegendCell( row1 , NOT_RUN_COLOR , LABELS_TEXT[ 'NOTRUN' ] , 'Not run' )
  table.append( row1 )

  var row2 = $( '<tr>' )
  addLegendCell( row2 , PASSED_WARNINGS_COLOR , LABELS_TEXT[ 'PASSED' ] , 'Passed with warning messages' )
  addLegendCell( row2 , FAILED_COLOR , LABELS_TEXT[ 'FAILED' ] , 'Failed' )
  table.append( row2 )


  return table


}

/**
 * Returns the structure of the title of the web page
 */
getHeader = function( arch, ibName ){

  var header = $( '<div>' )
  var title = $( '<h1>' ).text( 'Integration Build ' + ibName )
  var legendTitle = $( '<h5>' ).text( 'Legend: ' )
  var legendLink = getLinkWithGlyph( '#' + arch + ';' + ibName , 'Legend' , 'glyphicon-chevron-right' , '' )

  header.append( title ).append( $( '<br>' ) )

  var linkToMainPage = getLinkWithGlyph( 'https://cmssdt.cern.ch/SDT/html/showIB.html' , ' Back to IB Portal' , 'glyphicon-hand-up' , 'backToMainPageLink' )

  header.append( $( '<br>' ) ).append( linkToMainPage ).append( $( '<br>' ) )
  header.append( $( '<br>' ) )

  var legendDiv = $( '<div>' ).attr( 'class' , 'col-md-10' )
  var legendRow = $( '<div>' ).attr( 'class' , 'row' )
  legendRow.append( legendDiv )
  var legendTable = getLegendTable()
  legendTable.hide()
  legendDiv.append( legendTable )
  var toggleLegend = genToggleLegend( legendTable )
  legendLink.click( toggleLegend )

  header.append( legendLink  )
  header.append( legendRow )

  header.append( $( '<hr>' ) )


  return header

}

/**
 * Generates a link with the glyphicon, the text, and address given as parameter
 */
getLinkWithGlyph = function( linkAddress, text, glyph , id ){

  var link = $( "<a>" )
  link.attr( "href" , linkAddress )

  var span = $( '<span>' ).attr( 'class' , 'glyphicon ' + glyph )
  var spanText = $( '<span>' ).text( text )

  if( id != '' ){
    link.attr( 'id' , id )
    span.attr( 'id' , 'glyph-'+id ) 
    spanText.attr( 'id' , 'span-'+id )
  } 

  link.append( span )
  link.append( spanText )

  return link                        

}

/**
 * Generates a header that is created when the user didn't type any hash in te url
 */
getNoHashHeader = function( ){

  var div = $( '<div>' ).attr( 'class' , 'alert alert-danger' ).attr( 'role' , 'alert' ).attr( 'align' , 'center' )
  div.text( 'You need to specify which results you want me to show using the format ' )
  div.append( $( '<strong>' ).text( '#<arch>;<ib>' ) )

 
  return div


}

/**
 * Generates a header that informs the user that there were not found results for the given IB
*/
getNotFoundIBHeader = function( ibName ){

 var div = $( '<div>' ).attr( 'class' , 'alert alert-danger' ).attr( 'role' , 'alert' ).attr( 'align' , 'center' )
 div.text( 'No results were found for the IB ' )
 div.append( $( '<strong>' ).text( ibName) )


 return div


}



/**
 * Generates a header that alerts that there were not found results for the given arch, anyway, 
 * the results for the other archs are shown
 */
getNotFoundArchHeader = function( arch ){

 var div = $( '<div>' ).attr( 'class' , 'alert alert-warning' ).attr( 'role' , 'alert' ).attr( 'align' , 'center' )
 div.text( 'No results were found for the architecture ' )
 div.append( $( '<strong>' ).text( arch ) )
 

 return div


}

//-----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

/**
 * determines if the list containes the string given as a parameter
 * returns True if the list contains the string, False otherwise
 */
listContainsString = function( aString , list ){

  for( var i = 0; i < list.length; i ++){

    if ( list[ i ] == aString ){
      return true
    }
  }

  return false

}

//-----------------------------------------------------------------------------
// Togglers
// ----------------------------------------------------------------------------

/**
 * generates a toggler function for the summary table
 */
genToggleSummaryTables = function( genArch , genIB ){

  toggleSummaryTables = function(){

    for( var i = 0; i < MAX_STEPS; i++ ){

      $( '#summaryStep' + (i+1) + '-' + genArch + '-' + genIB ).toggle()

    }

    $( '#summarylabelsTable-' + genArch ).toggle()

    var toggleLinkText = $( '#span-toggleSummaryLink-' + genArch + '-' + genIB )
    var toggleLinkTextGlyph = $( '#glyph-toggleSummaryLink-' + genArch + '-' + genIB )

    if ( toggleLinkText.text() == 'Show summary' ){

      toggleLinkText.text( 'Hide summary' )
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-down' )

     }else {
      toggleLinkText.text( 'Show summary' )
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-right' )
     }
  }

  return toggleSummaryTables

}

/**
 * generates a toggler function for the hidden rows
 */
genToggleHiddenRows = function( genArch , genIB , minRow , maxRow ){

  toggleHiddenRows = function( ){

    for( var i = minRow + 1; i < maxRow; i++ ){
      $( '#row' + i + '-' + genArch ).toggle()
   
    }

    var showAllLinkText = $( '#span-showAllLink-' + genArch + '-' + genIB )
    var toggleLinkTextGlyph = $( '#glyph-showAllLink-' + genArch + '-' + genIB )

    if ( showAllLinkText.text() == 'Show All' ){
      showAllLinkText.text( 'Hide ' )
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-down' )

    }else {
      showAllLinkText.text( 'Show All' )
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-right' )
    }
  }

  return toggleHiddenRows
}

/**
 * Generates the function with the table that arrives as a parameter
 */
genToggleLegend = function( genTable ){
  /**
   * Toggles the table that shows the legend
   */
  toggleLegend = function(){

    console.log( 'toggle legend' )
    var glyph = $( this ).find( 'span.glyphicon' )
    
   if( glyph.attr( 'class' ) == 'glyphicon glyphicon-chevron-right' ){
      glyph.attr( 'class' , 'glyphicon glyphicon-chevron-down' )
    } else {
      glyph.attr( 'class' , 'glyphicon glyphicon-chevron-right' )
    }


    genTable.toggle()

  }

  return toggleLegend

}

toggleCommands2 = function( ){

  console.log( 'new function' )

  var glyph = $( this ).find( 'span.glyphicon') 

  if( glyph.attr( 'class' ) == 'glyphicon glyphicon-chevron-right' ){
    glyph.attr( 'class' , 'glyphicon glyphicon-chevron-down' )
  } else {
    glyph.attr( 'class' , 'glyphicon glyphicon-chevron-right' )
  }

  var urlParts = $(this).attr( 'href').split( ';' )  
  var arch = urlParts[ 0 ].replace( '#' , '' )
  var ib = urlParts[ 1 ]

  var releaseQueue = ib.substring( 0 , ib.lastIndexOf( "_" ) )
  var ibDate = ib.substring( ib.lastIndexOf( "_" ) + 1 , ib.length )

  var fileNameCommands = 'data/commands/' + arch + '/' + ibDate + '/' + releaseQueue + '.json'

  console.log( fileNameCommands )

  var cmdParts = $(this).attr( 'showCMD').split( ';' )
  var commandsDiv =  $( '#' + cmdParts[ 0 ].replace( '.' , '-' ) )
  var numSteps = cmdParts[ 1 ]

  togglerFunction = genToggleCommands( commandsDiv , numSteps , fileNameCommands , cmdParts[ 0 ].split( '-' )[ 3 ] )
  togglerFunction()

}


/**
 * Generates a toggler function for the commands Div
 * this also read the file with the command and writes it to the div if necessary
 */
genToggleCommands = function( commandsDiv , numSteps , fileNameCommands , workflowID ){
  /**
   * toggles the command div set before
   */
  toggleCommands = function( ){
  
    // this atribube indicates if the div has been shown, to avoid filling it again with the commands
    // each time the user clicks 
    if ( commandsDiv.attr( 'wasShown' ) == 'no' ){

      commandsDiv.attr( 'wasShown' , 'yes' )

      console.log( 'first time' )

      console.log( 'I have to check this file' )
      console.log( fileNameCommands )

      getHashCommandsToDiv = genGetHashCommandsToDiv(workflowID , numSteps , commandsDiv )

      $.getJSON( fileNameCommands , getHashCommandsToDiv )
      console.log( 'file read' )

    }


    commandsDiv.toggle()
    

  }

  return toggleCommands
}

//------------------------------------------------------------------------------------------------
// Progress Bar
// -----------------------------------------------------------------------------------------------

/**
 * sets the progress that arrives as parameter bar filled with a the percentage set as parameter
 */
setProgressBar = function ( progressBar , percentage ){

  progressBar.attr( 'style' , 'width: ' + percentage + '%' )
  progressBar.attr( 'aria-valuenow' , '20' )

}

//------------------------------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------------------------

PASSED_COLOR = 'rgb(92, 184, 92)'
PASSED_WARNINGS_COLOR = 'rgb(92, 145, 92)'
PASSED_ERRORS_COLOR = 'rgb(230, 188, 99)'
FAILED_COLOR = 'rgb(217, 83, 79)'
NOT_RUN_COLOR = 'rgb(153, 153, 153)' 

LABELS_TEXT = {}
LABELS_TEXT[ 'PASSED' ] = 'Passed'
LABELS_TEXT[ 'FAILED' ] = 'Failed '
LABELS_TEXT[ 'NOTRUN' ] = 'NotRun' 

MAX_STEPS=5
DEFAULT_STEPS=5

