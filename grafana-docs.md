# CMSSDT Grafana Dashboards

CMSSDT Grafana Dashboards are built out of the information extracted from the Jenkins infrastructure. In concrete, information fom the CMSSDT Jenkins CI/CD server job is extracted from the logs and pushed to OpenSearch.
Note that entire logs are not stored due to the high volume of daily jobs.

The stored information is used to monitor Jenkins status, IB build process, Unit Tests, RelVals, among others following a simple workflow:
1. Multiple Jenkins jobs extract the desired information and push it to OpenSearch.  
2. Information is organized in indexes.  
3. The different indexes are set as data sources to a Grafana instance.  
4. We can aggregate this data in different Dashboards that help in the monitoring tasks.

## OpenSearch Indexes
Data is organized in indexes that help us group information of a certain type together. Currently, we are pushing data on multiple indexes:

* **Jenkins Status**: `cmssdt-jenkins-jobs*` and `cmssdt-jenkins-queue*`.  
* **IB build process and Unit Test**: `cmssdt-jenkins-ibs*` and `cmssdt-ibs*`.  
* **RelVal resources**: `cmssdt-ib-matrix*`.  
* **Datasets used on IBs**: `cmssdt-ib-dataset*`.  
* **Access to cmspkg and SCRAM**: `cmssdt-cmspkg-access*` and `cmssdt-scram-access*`. 
* **Apache**: `cmssdt-apache-cmsrep*` and `cmssdt-apache-doxigen*`.  
* **AFS and EOS**: `cmssdt-cmssw-afs-eos*`.  
* **Other stats**: `cmssdt-externals_stats_summary*` and `cmssdt-relvals_stats_summary*`.

All the aforementioned indexes rotate every week except for:
* **CMSSW Git repository size**: `cmssdt-git-repository-size`.  


### Index Mappings

Every index has a mapping, which is the collection of information *fields* that are extracted from the logs. New fields can be pushed for a given index by just updating the scripts that push information to OpenSearch. Nevertheless, these new fields won't be recognized by the datastore.

To gently update the mapping for a given index, there is the [it-elasticsearch-project/endpoint-cmssdt1-settings](https://gitlab.cern.ch/it-elasticsearch-project/endpoint-cmssdt1-settings/-/tree/main/templates) GitLab repo with the mapping template in json format.

One can open a PR with their desired modifications.

### Index Rotation
Index are rotated weekly and there is a policy to keep them open for the last 8 weeks.
Closing old indexes allows for faster information retrieval.

The ES team takes care of the index policies. In this case, the following [policy](https://es-cmssdt.cern.ch/dashboards/app/opensearch_index_management_dashboards#/policy-details?id=delete_old_indices) is applied in OpenSearch to the indexes that rotate weekly:
-   Keep new index open for 8 weeks.
-   Close index once it is older than 8 weeks.
-   Delete index if 18 months have passed.

Indexes can be also opened and closed manually by running Jenkins jobs [`es-open-index`](https://cmssdt.cern.ch/jenkins/job/es-open-indexes/) and [`es-close-indexes`](https://cmssdt.cern.ch/jenkins/view/All/job/es-close-indexes/), respectively.



### Scripts pushing data to OpenSearch:
* Utilities script at [`es_utils.py`](https://github.com/cms-sw/cms-bot/blob/master/es_utils.py).
* Jenkins jobs and queue information at [`parse_jenkins_builds.py`](https://github.com/cms-sw/cms-bot/blob/master/parse_jenkins_builds.py).
* IBs logs at [`es_ibs_log.py`](https://github.com/cms-sw/cms-bot/blob/master/es_ibs_log.py).

*[More to come]*


## Dashboards

Dashboards are accessible from the [CMSSDT page](https://cmssdt.cern.ch/SDT/) in the [CMS-SDT Grafana](https://monit-grafana.cern.ch/d/TQX7baSZz/cmssdt-dashboard?orgId=11) link.

Currently there are 4 active dashboards:

* [**Jenkins Status Dashboard**](https://monit-grafana.cern.ch/d/83t0M504k/cmssdt-jenkins?orgId=11): Its source is the index `cmssdt-jenkins-jobs-*` and it displays information about the status of the infrastructure:
	* Job Status (succeed/failed rate) and Running Builds.
	* Time-shifts to monitor Running Builds for more than 12h.
	* Build queue and queue time. Also depending on the node type and labels.
	* Statistics on node performance and number of succeed/failed PR and IB jobs.

* [**Unit Test Dashboard**](https://monit-grafana.cern.ch/d/YxhKk0JVk/cmssdt-unit-tests?orgId=11&var-ReleaseQueue=CMSSW_13_1&var-IbFlavor=DEFAULT&var-IbFlavor=ROOT628_X&var-Architecture=el8_amd64_gcc11&var-TestName=PrimaryVertex): Its source is the `cmssdt-ibs-*` index and displays information about the failed Unit Tests for the IBs. In concrete:
	* Comparison of the number of failures depending on the release cycle and flavor type. Helps in comparing tables in the IB page.
	*	Monitor the day a concrete Unit Tests started failing. Helps in determine which CMSSW modifications caused the failures.

* [**RelVal Resources Dashboard**](https://monit-grafana.cern.ch/d/bB9CsmHWz/cmssdt-ibmatrix?orgId=11): Its source it is the index `cmssdt-ib-matrix*` and it monitors RelVal resources in terms of:
	* Information such as the average, maximum and minimum event time and CPU is available.
	* It allows to perform resource usage comparision between release cycles. Also filtering by *os\_arch\_compiler* type and workflow.

* [**CMSSW Git Repository Dashboard**](https://monit-grafana.cern.ch/d/srDrmWPWk/cmssdt-cmssw-repository-size?orgId=11): Its source is the `cmssdt-git-repository-size` index and it is updated daily to monitor the size of the [cms-sw/cmssw](https://github.com/cms-sw/cmssw) GitHub repository.

## Dashboard Backups
In order to back-up the Dashboards one need to move them to the Backup folder. CMS Monitoring have permissions to do this for you since they take care of the actual backup in the "General" tab of the Dashboard settings. The monitoring team takes grafana DB backups and write the json format of the dashboard to HDFS (with restricted access).

They also run job for moving the backups in `json` format to `/eos/cms/store/group/offcomp_monit/grafana_backup/` so that CMSSDT people can access them.

## Useful pointers

* CMS Monitoring team takes care of managing the indexes and data sources at [dmwm/CMSMonitoring](https://github.com/dmwm/CMSMonitoring/blob/master/static/datasources.json) GitHub repository.
	*  CMS Monitoring have permissions to change the Grafana data sources.
	* They also control the Backups.
* ES team for CMS manages our index mappings at [it-elasticsearch-project/endpoint-cmssdt1-settings](https://gitlab.cern.ch/it-elasticsearch-project/endpoint-cmssdt1-settings/-/tree/main/templates) GitLab project.
	*	ES team for CMS takes care of the Data Store migration and Index Policies.
*	There is a useful Mattermost Channel for fluent communication: https://mattermost.web.cern.ch/it-dep/channels/es-cms
