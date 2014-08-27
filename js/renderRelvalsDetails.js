//-------------------------------------------------------------------------------
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

    for( var i = 0; i < 5; i++ ){

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
   * Adds to the workflos table a row which has a link which toggles the workflows after the 20th
   */
  addShowAllRowLink = function( table , startRow , endRow ){

    var row = $( '<tr>' )
    var linkCell = $( '<td>' ).attr( 'colspan' , 7 )
    var showAllLink = getLinkWithGlyph( '#' + genArch + ';' + genIB  , 'Show All' , 'glyphicon-chevron-down' , 'showAllLink'+ '-' + genArch + '-' + genIB )

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
  if ( step == 0 ){
    filename = 'step1_dasquery.log'
  }else{
    filename = 'step' + ( parseInt( step ) + 1 ) + '_' + workflowName + '.log'
  }
   
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
getWorkflowCell = function( workflowID , workflowShortName , steps , arch , ib ){

  var cell = $( '<td>' )
  cell.append( $( '<span>' ).text( workflowID + ' ' +  workflowShortName + '  ' ) )
    
  link = $( "<a>" ).attr( "href" , '#' + arch + ';' + ib )
 // link.attr( 'style' , 'color:black' ) 
  link.append( $( '<small>' ).text( 'cmd' ) )
  cell.append( link )

  cell.append( $( '<br>' ) )
  
  var commandsDiv = $( '<div>' )

  commandsDiv.append( $( '<small>' ).append( $( '<strong>' ).text( 'Commands:' ) ) )
  commandsDiv.append( $( '<br>' ) )
  
  for ( var stepNumber in steps ){

    commandsDiv.append( $( '<small>' ).text( 'step' + (parseInt(stepNumber)+1) + ':' ) )
    commandsDiv.append( $( '<br>' ) )
    commandsDiv.append( $( '<small>' ).text( 'command' ) )
    commandsDiv.append( $( '<br>' ) )
  }

  link.click( genToggleCommands( commandsDiv ) )
  commandsDiv.hide()

  cell.append( commandsDiv )

  return cell
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

  row.append( getWorkflowCell( workflowResult.id , workflowResult.name.split( '+' )[0] , workflowResult.steps , arch , ib) )

  // this is to fill all the rows with cells
  var numCells = 0;

  var nothingRun = true;
  for ( var stepNumber in workflowResult.steps ){

    var text = workflowResult.steps[ stepNumber ][ 'status' ]

    var resLabel = $( '<span>' ).text( text )

    if( text == 'PASSED' ){

      nothingRun = false;
      resLabel.attr( 'class' , 'label label-success')

      var link = getLinkLabelToResultToResLabel( arch , ib , stepNumber , workflowResult.name , workflowResult.id , '' )
      link.append( resLabel )
      var cell = $( '<td>' ).append( link )

      row.append( cell )


    }else if( text == 'FAILED' ){

      nothingRun = false;
      resLabel.attr( 'class' , 'label label-danger')
      row.attr( 'class' , 'danger' )

      var link = getLinkLabelToResultToResLabel( arch , ib , stepNumber , workflowResult.name , workflowResult.id , '' )
      link.append( resLabel )
      var cell = $( '<td>' ).append( link )
      row.append( cell )


    }else if( text == 'NOTRUN' ){

      resLabel.attr( 'class' , 'label label-default')
      row.append( $( '<td>' ).append( resLabel ) )

    }else {

      resLabel.attr( 'class' , 'label label-default')
      row.append( $( '<td>' ).append( resLabel ) )

    }

    statistics[ stepNumber ][ text ]++;
    
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

  // fill the missing cells to have 5 in total
  for ( var numEmpty = 0; numEmpty < 5-numCells; numEmpty++ ){
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
 * Returns the table with the relvals results
 */
getTable = function( results , arch , ib ){

  var table = $( '<table>' ).attr( 'class' , 'table table-striped table-condensed' )
  table.attr( 'id' , 'resultsTable-' + arch + '-' + ib ) 

  addHeaderToTable( table )

  var resultsSummary = []
  for( var i = 0; i < 5 ; i++ ){
    var resultsDict = {
      "PASSED" : 0,
      "FAILED" : 0,
      "NOTRUN" : 0,
      "TOTAL"  : 0
    }
    resultsSummary[i] = resultsDict
  }

  var counter = 1;
  for ( var key in results ){
    // nothingRun is to know if no step was run in the workflow
    nothingRun = addWorkflowRow( results[ key ] , table , counter , resultsSummary , arch , ib , results.length )
    if ( !nothingRun ){
      counter++;
    }
  }

  addSummaryRow = genAddSummaryRow( arch , ib ) 
  addSummaryRow( table , resultsSummary )
 
  return table

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

  for ( var i = 0; i < 5 ; i++){

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
generateAddResultsTableToPane = function( tabPaneID , arch , ibName ){

  return function( results ){

    console.log ( 'modifying' )
    console.log ( tabPaneID )
    var table = getTable( results , arch , ibName )

    $( '#' + tabPaneID ).append( table )
  }

}



/**
 * Creates the tab panes based on the archsList and the IBName
 */
getTabPanes = function( archsList , ibName ){

  var tabContent = $( '<div>' ).attr( 'class' , 'tab-content' )


  for( var i = 0; i < archsList.length ; i++){

    var tabPaneClass = 'tab-pane'
    var arch = archsList[ i ]

    if ( arch == CURRENT_ARCH ){
      tabPaneClass += ' active'
    }
   
    var tabPaneID = arch + '-tab' 
    var tabPane = $( '<div>' ).attr( 'class' , tabPaneClass ).attr( 'id' , tabPaneID ) 
    
    var ibDate = ibName.substring( ibName.lastIndexOf( "_" ) + 1 , ibName.length ) 
    var releaseQueue = ibName.substring( 0 , ibName.lastIndexOf( "_" ) )
    var jsonFilePath = 'data/relvals/' + arch + '/' + ibDate + '/' + releaseQueue +'.json';

    var addResultsTableToPane = generateAddResultsTableToPane( tabPaneID , arch , ibName )

    console.log( 'Reading: ' )
    console.log( jsonFilePath )
    $.getJSON( jsonFilePath , addResultsTableToPane )

    console.log( 'Finished Reading: ' )

    tabContent.append( tabPane )
  }

  return tabContent


}

//-------------------------------------------------------------------------------
// Header
// ------------------------------------------------------------------------------

/**
 * Returns the structure of the title of the web page
 */
getHeader = function( arch, ibName ){

  var header = $( '<div>' )
  var title = $( '<h1>' ).text( 'Integration Build ' + ibName )


  header.append( title ).append( $( '<br>' ) )

  var linkToMainPage = getLinkWithGlyph( 'https://cmssdt.cern.ch/SDT/html/showIB.html' , ' Back to IB Portal' , 'glyphicon-hand-up' , 'backToMainPageLink' )

  header.append( $( '<br>' ) ).append( linkToMainPage ).append( $( '<hr>' ) ).append( $( '<br>' ) )

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

    for( var i = 0; i < 5; i++ ){

      $( '#summaryStep' + (i+1) + '-' + genArch + '-' + genIB ).toggle()

    }

    $( '#summarylabelsTable-' + genArch ).toggle()

    var toggleLinkText = $( '#span-toggleSummaryLink-' + genArch + '-' + genIB )
    var toggleLinkTextGlyph = $( '#glyph-toggleSummaryLink-' + genArch + '-' + genIB )

    if ( toggleLinkText.text() == 'Show summary' ){

      toggleLinkText.text( 'Hide summary' )
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-up' )

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
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-up' )

    }else {
      showAllLinkText.text( 'Show All' )
      toggleLinkTextGlyph.attr( 'class' , 'glyphicon glyphicon-chevron-down' )
    }
  }

  return toggleHiddenRows
}

/**
 * Generates a toggler function for the commands Div
 */
genToggleCommands = function( commandsDiv ){
  /**
   * toggles the command div set before
   */
  toggleCommands = function( ){
    commandsDiv.toggle()
  }

  return toggleCommands
}
