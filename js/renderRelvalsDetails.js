//-------------------------------------------------------------------------------
// RelVals Results
// ------------------------------------------------------------------------------

/**
 * Adds a row with the summary of the results
 */
addSummaryRow = function( table , statistics ){

  var row = $( '<tr>' )
  row.append( $( '<td>' ) )

  var showSummaryLink = getLinkWithGlyph( '#' + ARCH + ';' + IB , 'Show summary' , 'glyphicon-chevron-right' , 'toggleSummaryLink' )

  var labelsTable = $( '<table>' ).attr( 'id' , 'summarylabelsTable'  ).attr( 'align' ,'right' ) 
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

    var summaryTable = $( '<table>' ).attr( 'id' , 'summaryStep' +( i+1 ) ).attr( 'align' ,'left' )
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

/**
 * Adds to the workflos table a row which has a link which toggles the workflows after the 20th
 */
addShowAllRow = function( table , startRow ){

  var row = $( '<tr>' )
  var linkCell = $( '<td>' ).attr( 'colspan' , 7 )
  var showAllLink = getLinkWithGlyph( '#FakeID' , 'Show All' , 'glyphicon-chevron-down' , 'showAllLink' )

  linkCell.append( showAllLink )
  row.append( linkCell )
  table.append( row )

}

/**
 * Adds a row to the workflow with the relval result info, it also modifies the statistics
 * as they are until the moment that te workflow is read.
 * The statistics is a array of dictionaries, each position has a dictionary with the entries
 * "passed" , "failed" and "notrun" with the numbers for the step
 */
addWorkflowRow = function( workflowResult , table , counter , statistics , arch , ib ) {

  var row = $( '<tr>' ).attr( 'id' , 'row' + counter + '-' + arch )

  row.append( $( '<td>' ).append( $( '<b>'  ).text( counter ) ) )

  var workflowName = workflowResult.id + ' ' + workflowResult.name.split( '+' )[0]
  row.append( $( '<td>' ).text( workflowName ) )

  // this is to fill all the rows with cells
  var numCells = 0;

  var nothingRun = true;
  for ( var stepNumber in workflowResult.steps ){

    var text = workflowResult.steps[ stepNumber ][ 'status' ]

    var resLabel = $( '<span>' ).text( text )

    if( text == 'PASSED' ){

      nothingRun = false;
      resLabel.attr( 'class' , 'label label-success')

    }else if( text == 'FAILED' ){

      nothingRun = false;
      resLabel.attr( 'class' , 'label label-danger')
      row.attr( 'class' , 'danger' )

    }else if( text == 'NOTRUN' ){

      resLabel.attr( 'class' , 'label label-default')

    }else {

      resLabel.attr( 'class' , 'label label-default')

    }

    statistics[ stepNumber ][ text ]++;
    
    // when it is not run it doesn't count in the total
    if( text != 'NOTRUN' ){
      statistics[ stepNumber ][ "TOTAL" ]++;
    }

    row.append( $( '<td>' ).append( resLabel ) )
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
    addShowAllRow( table , 20 )
  }

  return false;
        
}

/**
 * Returns the table with the relvals results
 */
getTable = function( results , arch , ib ){

  var table = $( '<table>' ).attr( 'class' , 'table table-striped table-condensed' )
  table.attr( 'id' , 'resultsTable;' + arch + ';' + ib ) 

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
    nothingRun = addWorkflowRow( results[ key ] , table , counter , resultsSummary , arch , ib )
    if ( !nothingRun ){
      counter++;
    }
  }

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

  var link = $( "<a>" ).attr( "href" , linkAddress ).attr( 'id' , id )
  link.append( $( '<span>' ).attr( 'class' , 'glyphicon ' + glyph ).attr( 'id' , 'glyph-'+id ) )
  link.append( $( '<span>' ).text( text ).attr( 'id' , 'span-'+id ) )

  return link                        

}

