---
title: CMS Offline Software
layout: default
related:
 - { name: Project page, link: 'https://github.com/cms-sw/cmssw' }
 - { name: Feedback, link: 'https://github.com/cms-sw/cmssw/issues/new' }
---

Following Diego advice I started implementing service metrics for the CMS SDT
related services, like Mesos and similar, so that they are integrated in the
CERN/IT provided monitoring infrastructure. Metrics and alarms are defined
using:

<http://metricmgr.cern.ch>

In particular all the CMS SDT related ones start with `cmssdt_`. [^1][]

In order to create a new metric you just need to go to the `Manage > Add
Metric` menu item and create a new one with the following information:

- Metric class: what you are actually monitoring, e.g. we use `url.httpcode`
  for checking the return code from a web page.
- Metric name: a mnemonic name associated to the metric, e.g. `cmssdt_mesos`.
- Description: some sensible description of what you are monitoring.
- Period: the interval period for polling the metric (e.g. 600 seconds for
  `cmssdt_mesos`)
- Latest only: whether or not you are interested in the history of the metric.
- Responsible: the e-group responsible for the metric. This should be
  `cmssdt-core`.

You can then specify some metric parameters, which depend on your "Metric
class". In the case of `url.httpcode` you need for example to specify which url
to check. This is done by adding a JSON dictionary containing your options.
E.g. for `cmssdt_mesos`:

```
{
"url": "localhost:5050/health"
}
```

where `localhost:5050/health` is a URL which returns with 200 when Mesos is up
and running.

Once you are done, you will get a summary page with the details for the metric
and a puppet snippet, e.g.:

```
lemon::metric{'13248':}
```

which you will have to paste in the puppet manifest of the host where you want
the metric to run. Before you do so, make sure you click on "Change state to
pending" so that the metric is actually acknowledged from the CERN/IT
monitoring support.

After puppet runs, but before the metric enters production, you can check it by
running:

```
lemon-cli --l --m 13249
```

while once it's in production you can also go to CERN/IT kibana page:

<http://meter.cern.ch>

and get the results by going to the [Host
Metrics](https://meter.cern.ch/public/_plugin/kibana/#/dashboard/elasticsearch/Metrics:%20Host)
page and then changing the Filtering so that you have:

```
field : @fields.metric_id
query : 13249
```

You can then adapt one of the plots to show the values.

Notice the the CMS HTTP GROUP people (Diego & c.) have already some
documentation on how to set up metrics and alarms:

<https://cern.ch/cms-http-group/ops-servers.html#updating_the_alarming_instructions>

and CERN/IT has of course documentation about their infrastructure:

<https://metricmgr.cern.ch/help/>

[^1]: You can find the full list by going to that web page, clicking on
"Metrics" and then searching for `cmssdt_`. Current list of metrics include,
`cmssdt_mesos`, `cmssdt_marathon` which check the return code for the
associated web pages.
