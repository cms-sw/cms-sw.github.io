//------------------------------------------------------------------------------------------
// Tabs and Menu Bar
//------------------------------------------------------------------------------------------


/**
 * receives the structure from the json file with all the release queues grouped
 * It generates a Menu Bar to open the different tabs
 */
getMenuBar = function(structure){
  var allQueues = structure.all_prefixes
  var menuBar = $('<nav>')
  menuBar.attr( 'id', 'topNavBar' ).attr( 'class', 'navbar navbar-primary').attr( 'role', 'navigation' ) 

  var barContainer = $('<div>')
  barContainer.attr( 'class', 'container-fluid' )
  menuBar.append( barContainer )

  var navBarCollapse = $('<div>')
  navBarCollapse.attr( 'class', 'collapse navbar-collapse' ).attr( 'id', 'bs-example-navbar-collapse-1' )
  barContainer.append(navBarCollapse)

  var navBarUl = $('<ul>')
  navBarUl.attr( 'class', 'nav navbar-nav' )
  navBarCollapse.append(navBarUl)

  for(var i = 0; i < allQueues.length; i++){
    addDropDownList(navBarUl,allQueues[i],structure[allQueues[i]])
  }
return menuBar
} 

/**
 * Adds a drop down list to a menu list item
 */
addDropDownList = function( navBarUl, releaseName, releaseQueues ){

  var liRelName = $('<li>')
  liRelName.attr( 'class', 'dropdown' )
  linkTitle = $( '<a>' )
  linkTitle.attr( 'class', 'dropdown-toggle' ).attr( 'data-toggle', 'dropdown').attr( 'href', '#' )
  linkTitle.text( releaseName )

  linkTitle.append( $('<b>').attr( 'class', 'caret' ) )
  liRelName.append(linkTitle)
  navBarUl.append(liRelName)

  var dropDownMenu = $('<ul class="dropdown-menu">')
  dropDownMenu.attr( 'class', 'dropdown-menu' )
  liRelName.append(dropDownMenu)

  for (var i = 0; i < releaseQueues.length; i++){
    var releaseQueue = releaseQueues[i]
    var link = $('<a>').text(releaseQueue).attr("href", '#'+releaseQueue)
    var liReleaseQueue = $('<li>').append(link)
    link.click(function (e) {
      e.preventDefault()
      var tab = $(this).attr('href')
      loadTabPane( tab.replace( '#', '') )
      $('#myTab a[href='+tab+']').tab('show')
    })
    dropDownMenu.append(liReleaseQueue)
    liReleaseQueue = null
  }
}

/**
 * creates and returns the tabs based on the json structure
 */
getTabs = function( structure ){

  var tabs = $( '<ul>' )
  tabs.attr( 'id', 'myTab' ).attr( 'class', 'nav nav-tabs hidden' )

  var all_releases = structure.all_release_queues
  
  for(var i = 0; i < all_releases.length; i++){
    var releaseQueue = all_releases[i];
    var tab_title = $('<li><a href="#'+releaseQueue+'" data-toggle="tab">'+releaseQueue+'</a></li>')
    tabs.append( tab_title )
  } 

  return tabs

}

/**
 * creates and returns the tabs panes inside a div to put the content on them,
 * based on the structure
*/
getTabPanes = function( structure ){

  var tabs_content = $('<div>')
  tabs_content.attr("id","tabs_container").attr( 'class', 'tab-content' )
  var all_releases = structure.all_release_queues
  
  for(var i = 0; i < all_releases.length; i++){
    var releaseQueue = all_releases[i];
    var tab_pane = $('<div>')
    tab_pane.attr( 'id', releaseQueue )
    tab_pane.attr( ALREADY_LOADED_ATTR, 'no' )

    //by default, the first one is the one which starts as active
    if ( i == 0 ){
      tab_pane.attr( 'class', 'tab-pane active' )      
    }else{
      tab_pane.attr( 'class', 'tab-pane' )
    }

    // write the titles for the release queue
    var title_rel_name=$( "<h1>" ).text( releaseQueue )
    tab_pane.append( title_rel_name )
    tab_pane.append( $( "<hr>" ) )
    tab_pane.append( $( "<br>" ) )

    tabs_content.append( tab_pane )
  }

  return tabs_content
}

//------------------------------------------------------------------------------------------
// Tabs Content
//------------------------------------------------------------------------------------------

/**
 * fills tab panes based on the structure. It determines the correct files to download 
 * and calls the function to add this information to the tab pane
 */
fillTabPanes = function( structure ){

  $.getJSON( "data/RelvalsAvailableResults.json", loadFilesLists )

}


/**
 * It reads the file data/RelvalsAvailableResults.json and creates a list of files to read 
 * per eachIB. This files have the information about which exceptions are found in the IB
 */
loadFilesLists = function( relvasAvailableResults ){
 
  // this is to organize the keys before showing the ibs
  exceptionsAvailResults = {}
  
  for( key in relvasAvailableResults ){

    if( key.indexOf( "EXCEPTIONS" ) >= 0 ){
      var ib = key.replace( "_EXCEPTIONS", "" )
      exceptionsAvailResults[ ib ] = relvasAvailableResults[ key ]
    }
  }

  allIBs = $.map( exceptionsAvailResults, function(element,index) {return index}).sort().reverse()

  for( var i = 0; i < allIBs.length ; i++ ){

    currentIB = allIBs[ i ]
    var archs = relvasAvailableResults[ currentIB + '_EXCEPTIONS' ]
    var releaseQueue = currentIB.substring( 0 , currentIB.lastIndexOf( "_" ) )                 
      
    var tabPane = $( '#'+releaseQueue )
    var title = $( '<h3>' ).text( currentIB ).attr( 'id', currentIB )
    tabPane.append( title )   

    var table = $( '<table>' ).attr( 'id', 'table-' + currentIB ).attr( 'class', 'table table-condensed' )
    table.attr( AVAILABLE_ARCHS_ATTR, exceptionsAvailResults[ currentIB ] )
    tabPane.append( table )

    var row = $( '<tr>' )
    table.append( row )

    var exceptionHeader = $( '<th>' ).text( 'Exception' )
    row.append( exceptionHeader )

    var workflowHeader = $( '<th>' ).text( 'Workflows' )
    row.append( workflowHeader )

    tabPane.append( $( '<br>' ) )
  }

  loadActiveTabPane()


}

/**
 * selects the tab pane that is active and loads it
 */
loadActiveTabPane = function(){

  var activeTab = $( '.active' )
  var releaseQueue = activeTab.attr( 'id' )
  loadTabPane( releaseQueue )
}

/**
 * Iterates on the tables of the IBs and loads them with the information 
 * from the corresponding files
 */
loadTabPane = function( releaseQueue ){

  var tabPane = $( '#' + releaseQueue )
  alreadyLoaded = tabPane.attr( ALREADY_LOADED_ATTR )
  if ( alreadyLoaded == 'yes' ){
    return 
  }

  var tables = tabPane.children( ".table" )
  tables.each( loadTable )

  tabPane.attr( ALREADY_LOADED_ATTR, 'yes' )

}

/**
 * loads a table based on its attributes
 * it can be called by a .each()
 */
loadTable = function( table ){

  if( $.isNumeric( table ) ){
    table = $( this )
  }
  var ib = table.attr( 'id' ).replace( 'table-', '' )
  var archs = table.attr( AVAILABLE_ARCHS_ATTR )
  var archs_list = archs.split( "," )
  var releaseQueue = ib.substring( 0 , ib.lastIndexOf( "_" ) )
  var ibDate = ib.substring( ib.lastIndexOf( "_" ) + 1 , ib.length )
 
  for( var i = 0; i < archs_list.length; i++ ){
    current_arch = archs_list[ i ]
    filenameExceptions = 'data/relvals/' + current_arch + '/' + ibDate + '/' + releaseQueue + '_EXCEPTIONS.json'
    infoAdderFunct = genAddInfoTable( table, current_arch )
    $.getJSON( filenameExceptions, infoAdderFunct )

  }

}

genAddInfoTable = function( table, arch ){
  /**
   * Adds the information in the structure to the table for which 
   * this function is generated
   */
  addInfoTable = function( structure ){
    var ib = table.attr( 'id' ).replace( 'table-', '' )

    var counter = 0
    for( exception in structure ){
      subTableID = IB_EXCEPTIONS_SUBTABLES_IDS[ ib + ',' + exception ]
      
      
      if ( subTableID == undefined ){
        var row = $( '<tr>' )
        table.append( row )
        var exCell = $( '<td>' )
        row.append( exCell )
        var samp = $( '<samp>' )
        samp.text( exception )        

        exCell.append( $( '<small>' ).append( $( '<p>' ).append( samp ) ) )

        // create a subtable for the architectures
        var subTBLCell = $( '<td>' )
        row.append( subTBLCell )
        var subTable = $( '<table>' )
        subTBLCell.append( subTable )
        var subTableID = ib + '-' + arch + '-' + counter
        subTable.attr( 'id', subTableID )
        IB_EXCEPTIONS_SUBTABLES_IDS[ ib + ',' + exception ] = subTableID

        addArchAndWorkflowsSubTable( subTable, structure[ exception ], arch )

        counter++
      }else {
        
        subTable = $( '#' + subTableID )
        console.log( "adding not new to:" )
        console.log( '#' + subTableID )
        addArchAndWorkflowsSubTable( subTable, structure[ exception ], arch )

      }
      

    }

  }

  return addInfoTable
}

/**
 * Adds to the archs subtable for an IB the correspongin information
 * of the list of workflows
 */
addArchAndWorkflowsSubTable = function( subTable, wfList, arch ){
  var subTRow = $( '<tr>' )
  subTable.append( subTRow )
  var archCell = $( '<td>' )
  subTRow.append( archCell )
  var archBold = $( '<b>' ).text( arch + ': ' )
  archCell.append( archBold )
        
  var wfsCell = $( '<td>' )
  subTRow.append( wfsCell )
  wfsCell.append( $( '<p>' ).append( wfList.join(", ") ) )

}

// custom properties
ALREADY_LOADED_ATTR = 'already-loaded'
AVAILABLE_ARCHS_ATTR = 'avialable-archs'

IB_EXCEPTIONS_SUBTABLES_IDS = {}
IB_EXCEOTIONS_ARCHS_TEXT_IDS = {}
