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
  
  var subtitle = $( '<h2>' ).text( 'Unit Tests Details' )

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

//-----------------------------------------------------------------------------
// Results
// ----------------------------------------------------------------------------

/**
 * It generates a function that 
 * Reads the results of one file, gets the table, and appends it to the tab pane
*/
generateAddResultsTableToPane = function( tabPaneID , arch , ibName ){


  return function( results ){

    console.log ( 'modifying' )
    console.log ( tabPaneID )

    startDate = new Date()
    console.log( 'start: ' + startDate )
    var table = $( '<table>' )
    $( '#' + tabPaneID ).append( table )
    addRowsTable( results , arch , ibName , table )
    console.log( 'Results : ' + results.length )

    endDate = new Date()
    console.log( 'end: ' + endDate )

    console.log( endDate - startDate )


  }

}

/**
 * Adds to the table with relvals results
*/
addRowsTable = function( results , arch , ib , table ){

  table.attr( 'class' , 'table table-striped table-condensed' )
  table.attr( 'id' , 'resultsTable-' + arch + '-' + ib )

  addHeaderToTable( table )

  var counter = 1;
  for ( var key in results ){
    
    addUnitTestRow( results[ key ] , table , counter , arch , ib  )
    counter++
  }


}
/**
 * generates a result cell with the number of the tests that are failing
 * and the ones that are ok
 */
getResultUnitTestsCell = function( unitTestResult , arch , ib){

  var numFail = unitTestResult[ 'errors' ].length
  var resultCell = $( '<td>' )
  var text = unitTestResult[ 'ok' ].length + ' OK ' + numFail + ' Fail'

  var label = $( '<span>' )
  label.append( $( '<samp>' ).text( text ) )

  if ( numFail > 0 ){

    label.attr( 'class' , 'label label-danger' )

  }else {

    label.attr( 'class' , 'label label-success' )

  }

  var linkAddress = getUnitTestLogAddress( arch , ib , unitTestResult[ 'name' ] )
  var link = $( "<a>" ).attr( "href" , linkAddress )
  link.attr( 'style' , 'color:black' )
  link.append( label )

  resultCell.attr( 'align' , 'center' )
  resultCell.append( link )

  return resultCell
}

/**
 * returns the address of the log of the unit test given as a parameter
 */
getUnitTestLogAddress = function( arch , ib , packageName ){

  return 'http://cmssdt.cern.ch/SDT/cgi-bin/buildlogs/' + arch +'/' + ib + '/unitTestLogs/' + packageName

}
/**
 * Adds the unit a row to the table with the unit test results
 * returns true if everything was ok, false if something failed
 */
addUnitTestRow = function( unitTestResult , table , counter , arch , ib ) {

  var row = $( '<tr>' ).attr( 'id' , 'row' + counter + '-' + arch )
  table.append( row )

  row.append( $( '<td>' ).append( $( '<b>'  ).text( counter ) ) )

  var packageCell = $( '<td>' )

  packageCell.text( unitTestResult[ 'name' ] )

  row.append( packageCell )

  var numFail = unitTestResult[ 'errors' ].length
  
  var resultsUnitTestsCell = getResultUnitTestsCell( unitTestResult , arch , ib)
  row.append( resultsUnitTestsCell )

  if( numFail > 0 ){

    row.attr( 'class' , 'danger' )

  }


}

/**
 * Adds the header to the unit tests table
*/
addHeaderToTable = function ( table ) {

  var testNumber = $( '<th>' ).text( "#" )
  var testTitle = $( '<th>' ).text( "subsystem/package" )
  var unitTestsTitle = $( '<th>' ).text( "Unit Tests" ).attr( 'style' , 'text-align: center;' )

  var headRow = $( '<tr>' )

  headRow.append( testNumber )
  headRow.append( testTitle )
  headRow.append( unitTestsTitle )


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
    var jsonFilePath = 'data/unitTests/' + arch + '/' + ibDate + '/' + releaseQueue +'.json';

    tabContent.append( tabPane )
    var addResultsTableToPane = generateAddResultsTableToPane( tabPaneID , arch , ibName )

    console.log( 'Reading: ' )
    console.log( jsonFilePath )
    $.getJSON( jsonFilePath , addResultsTableToPane )

    console.log( 'Finished Reading ' )

  }


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
    var itemID = archName + '-' + ibName + '-tabLiItem'
    item.attr( 'id' , itemID )
    var tabID = archName + '-' + ibName + '-tab'
   
    tabLink.click( genShowTab( tabLink ) )
    tabLink.text( archName )
  
    item.append( tabLink )
    tabList.append( item )
   }
  
  return tabList

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

//------------------------------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------------------------


