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
generateAddResultsTableToPane = function( tabPaneID, arch, ibName, progressBar, progressDiv, areIncomplete ){


  return function( results ){

    console.log ( 'modifying' )
    console.log ( tabPaneID ) 
    setProgressBar( progressBar , 50 )

    startDate = new Date()
    console.log( 'start: ' + startDate )
    var table = $( '<table>' )
    $( '#' + tabPaneID ).append( table )
    addRowsTable( results, arch, ibName, table, progressBar, areIncomplete )

    progressDiv.hide( 100 )

    endDate = new Date()
    console.log( 'end: ' + endDate )

    console.log( endDate - startDate )

    
  }

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
  
  var subtitle = $( '<h2>' ).text( 'Compilation Results' )

  header.append( title ).append( $( '<br>' ) )
  header.append( subtitle )

  var linkToMainPage = getLinkWithGlyph( 'https://cmssdt.cern.ch/SDT/html/showIB.html' , ' Back to IB Portal' , 'glyphicon-hand-up' , 'backToMainPageLink' )

  header.append( $( '<br>' ) ).append( linkToMainPage ).append( $( '<br>' ) )

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

/**
 * Generates a header that alerts that there were no COMPLETE results found for the given arch
 */
getIncompleteArchHeader = function( arch ){

  var div = $( '<div>' ).attr( 'class' , 'alert alert-warning' ).attr( 'role' , 'alert' ).attr( 'align' , 'center' )
  div.text( 'Showing incomplete results for ' )
  div.append( $( '<strong>' ).text( arch ) )
  return div

}

//-----------------------------------------------------------------------------
// Results
// ----------------------------------------------------------------------------

/**
 * It generates a function that 
 * Reads the results of one file, gets the table, and appends it to the tab pane
*/
generateAddResultsTableToPane = function( tabPaneID, arch, ibName, areIncomplete ){


  return function( results ){

    console.log ( 'modifying' )
    console.log ( tabPaneID )

    console.log( 'start: ' + startDate )
    var table = $( '<table>' )
    $( '#' + tabPaneID ).append( table )
    addRowsTable( results, arch, ibName, table, areIncomplete )
   



  }

}

/**
 * Adds row to the table with the scram results
 * hides the rows from HIDDEN_ROWS_NUMBER
 */
addScramResultRow = function( key, scramResult, table, counter, arch, ib, totalRows ) {
  // here the id should include the package name to handle complete results 
  // and unit tests in the future. 
  var row = $( '<tr>' ).attr( 'id' , 'row' + counter + '-' + arch )
  table.append( row )

  row.append( $( '<td>' ).append( $( '<b>' ).text( counter ) ) )
  
  var packageCell = $( '<td>' )
  packageCell.text( key )
  row.append( packageCell )

  var diffCell = $( '<td>' )
  diffCell.text( scramResult[ 'diff' ]  )
  row.append( diffCell )

  var startCell = $( '<td>' )
  startCell.text( scramResult[ 'start' ]  )
  row.append( startCell )

  var stopCell = $( '<td>' )
  stopCell.text( scramResult[ 'stop' ]  )
  row.append( stopCell )

  if ( counter > HIDDEN_ROWS_NUMBER ){
    row.hide()
  }

  if ( counter == HIDDEN_ROWS_NUMBER ){
    addShowAllRowLink = genAddShowAllRowLink( arch, ib )
    addShowAllRowLink( table, HIDDEN_ROWS_NUMBER, totalRows )
  }

}

/*
* Adds the header to the scram results table
*/
addHeaderToTable = function ( table ) {
 
  var testNumber = $( '<th>' ).text( "#" )
  var packageTitle = $( '<th>' ).text( "subsystem/package" )
  var diffTitle = $( '<th>' ).text( "Diff" ).attr( 'style' , 'text-align: center;' )
  var startTitle = $( '<th>' ).text( "Start" ).attr( 'style' , 'text-align: center;' )
  var stopTitle = $( '<th>' ).text( "Stop" ).attr( 'style' , 'text-align: center;' )

  var headRow = $( '<tr>' )

  headRow.append( testNumber )
  headRow.append( packageTitle )
  headRow.append( diffTitle )
  headRow.append( startTitle )
  headRow.append( stopTitle )


  var header = $( '<thead>' )
  header.append( headRow )
  table.append( header )

}


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


  var link = 'https://cmssdt.cern.ch/SDT/cgi-bin/showBuildLogs.py/' + arch +'/www/' + weekDay + '/' + dayTimeRel + '/' + ibName

  return link

}


//-----------------------------------------------------------------------------
// Tabs
// ----------------------------------------------------------------------------

/**
 * Adds to the table the scram results found in the json file
 */
addRowsTable = function( results, arch, ib, table, areIncomplete ){

  table.attr( 'class' , 'table table-striped table-condensed' )
  table.attr( 'id' , 'resultsTable-' + arch + '-' + ib )
  addHeaderToTable( table )

  var counter = 1;
  for ( var key in results ){

   // since all of them are run in the same host, I only get the first result for the hostname
   if ( counter == 1 && areIncomplete ){
     hostname = results[ key ][ 'hostname' ]
     targetMsgDiv = $( '#incompleteMsgDiv-' + arch + '-' + ib )
     originalText = targetMsgDiv.text()
     newText = originalText + " in " + hostname
     targetMsgDiv.text( newText )
    }
    addScramResultRow( key, results[ key ], table, counter, arch, ib, Object.keys( results ).length )
    counter++
  }

}

/**
 * It generates a function that
 * Reads the results of one file, gets the table, and appends it to the tab pane
*/
generateAddResultsTableToPane = function( tabPaneID, arch, ibName, progressBar, progressDiv, areIncomplete ){

  return function( results ){
    console.log ( 'modifying' )
    console.log ( tabPaneID )
    setProgressBar( progressBar , 50 )

    var table = $( '<table>' )
    $( '#' + tabPaneID ).append( table )
    addRowsTable( results, arch, ibName, table, progressBar, areIncomplete )
    progressDiv.hide( 100 )
  }
}

/**
 * fills the tab pane for the case when the results are incomplete
 */
fillIncompleteResultTabPanes = function( tabPanes, incompleteArchsList, ibName ){

  for( var i = 0; i < incompleteArchsList.length ; i++){
    var tabPaneClass = 'tab-pane'
    var arch = incompleteArchsList[ i ]
    if ( arch == CURRENT_ARCH ){
      tabPaneClass += ' active'
    }
    var tabPaneID = arch + '-tab'
    var tabPane = $( '<div>' ).attr( 'class' , tabPaneClass ).attr( 'id' , tabPaneID )
    var incompleteMsgDiv = $( '<div>' ).attr( 'class' , 'alert alert-warning' ).attr( 'role' , 'alert' ).attr( 'align' , 'center' )
    incompleteMsgDiv.text( 'The results for this architecture are incomplete! The build should be in progress' )
    incompleteMsgDiv.attr( 'id', 'incompleteMsgDiv-' + arch + '-' + ibName )
    tabPane.append( incompleteMsgDiv )
    var ibDate = ibName.substring( ibName.lastIndexOf( "_" ) + 1 , ibName.length )
    var releaseQueue = ibName.substring( 0 , ibName.lastIndexOf( "_" ) )
    var jsonFilePath = 'data/scram/' + arch + '/' + ibDate + '/' + releaseQueue + '_INCOMPLETE' +'.json';

    var progressDiv = $( '<div>' ).attr( 'class' , 'progress' )
    var progressBar = $( '<div>' ).attr( 'class' , 'progress-bar progress-bar-striped active' ).attr( 'role' , 'progressbar' )
                                       .attr( 'aria-valuenow' , '0' ) .attr( 'aria-valuemin' , '0' )
                                       .attr( 'aria-valuemax' , '100' ).attr( 'style' , 'width: 30%;' )
                                       .text( 'loading...' )

    progressDiv.append( progressBar )
    tabPane.append( progressDiv )
    tabPanes.append( tabPane )

    var addResultsTableToPane = generateAddResultsTableToPane( tabPaneID, arch, ibName, progressBar, progressDiv, true )
    $.getJSON( jsonFilePath, addResultsTableToPane )

  }

}


/**
 * Creates the tab panes based on the archsList and the IBName
*/
fillTabPanes = function( tabPanes, archsList, incompleteArchsList, ibName ){
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
    // TODO: modify it to show complete results when available. for now the only results shown are incomplete
    var jsonFilePath = 'data/unitTests/' + arch + '/' + ibDate + '/' + releaseQueue +'.json';

    tabPanes.append( tabPane )
//    var addResultsTableToPane = generateAddResultsTableToPane( tabPaneID , arch , ibName )

    console.log( 'Reading: ' )
    console.log( jsonFilePath )
//    $.getJSON( jsonFilePath , addResultsTableToPane )

    console.log( 'Finished Reading ' )

  }

  fillIncompleteResultTabPanes( tabPanes, incompleteArchsList, ibName )

}



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
 * * From a list of archs, it creates and appends tabs to the list.
 * * oneSelected indicates if there was a tab set as active
 * */
addTabsFromList = function( archsList, tabList ){
  var oneSelected = false;
  for( var i = 0; i < archsList.length ; i ++){
    var item = $( '<li>' )
    var archName = archsList[ i ]
    //if the it is the requested arch it is active
    if( archName == ORIGINAL_ARCH ){
      item.attr( 'class' , 'active' )
      oneSelected = true
      CURRENT_ARCH = archName
    }
    var tabLink = $( '<a>' ).attr( 'href' , '#' + archName + '-tab' )
    tabLink.click( genShowTab( tabLink ) )
    tabLink.text( archName )
    item.append( tabLink )
    tabList.append( item )
  }
  return oneSelected
}

/**
 * Creates the navtabs with based on the archsList the ibName is for creating the link
*/
getNavTabs = function( archsList, incompleteArchsList, ibName ){
  var tabList = $( '<ul>' ).attr( 'class', 'nav nav-tabs').attr( 'role' , 'tablist')
  var oneSelected = addTabsFromList( archsList, tabList )
  oneSelected = oneSelected || addTabsFromList( incompleteArchsList, tabList )

  if( !oneSelected ){
    tabList.children('li').last().attr( 'class' , 'active' )
    CURRENT_ARCH = tabList.children('li').last().children('a').text()
  }

  return tabList

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
// Generated Links
//----------------------------------------------------------------------------

/**
 * Generates the function with the given arch and given IB to take them into account in the id and url
 */
genAddShowAllRowLink = function( genArch, genIB ){
  
  /**
   * Adds to the workflows table a row which has a link which toggles the workflows after the HIDDEN_ROWS_NUMERth
   */
  addShowAllRowLink = function( table, startRow, endRow ){
    
    var row = $( '<tr>' )
    var linkCell = $( '<td>' ).attr( 'colspan' , 3 )
    var showAllLink = getLinkWithGlyph( '#' + genArch + ';' + genIB, 'Show All' , 'glyphicon-chevron-right' , 'showAllLink'+ '-' + genArch + '-' + genIB )
    showAllLink.click( genToggleHiddenRows( genArch, genIB, startRow, endRow ) )
    linkCell.append( showAllLink )
    row.append( linkCell )
    table.append( row )
  }
  return addShowAllRowLink
}
//-----------------------------------------------------------------------------
// Togglers
// ----------------------------------------------------------------------------

/**
 * * generates a toggler function for the hidden rows
 * */
genToggleHiddenRows = function( genArch, genIB, minRow, maxRow ){

  toggleHiddenRows = function( ){
    
    for( var i = minRow + 1; i < maxRow; i++ ){
      $( '#row' + i + '-' + genArch ).toggle()
      console.log( '#row' + i + '-' + genArch )
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
 * generates a function to toggle the div with the details of the unit tests
 * changes the glyphicon of the link
 */
toggleUTestDetails = function( ){
  
  var glyph = $( this ).find( 'span.glyphicon')

  if( glyph.attr( 'class' ) == 'glyphicon glyphicon-chevron-right' ){
    glyph.attr( 'class' , 'glyphicon glyphicon-chevron-down' )
  } else {
    glyph.attr( 'class' , 'glyphicon glyphicon-chevron-right' )
  }

  var utestToShowID = $(this).attr( 'showutest')
  var divUtestToShow = $( '#' + utestToShowID )

  if ( divUtestToShow.attr( 'wasShown' ) == 'no' ){
     divUtestToShow.attr( 'wasShown' , 'yes' )
  }

  divUtestToShow.toggle()
}




//------------------------------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------------------------

// Determines how many rows are shown by default
HIDDEN_ROWS_NUMBER=20
