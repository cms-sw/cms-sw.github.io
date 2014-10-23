---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---


# Latest IBs

{% assign sortedReleaseQueues = site.data.LatestIBsSummary | sort %}
{% assign sortedArchs = site.data.LatestIBsSummary.all_archs | sort %}
<table>
  <tr>
    <td>
    </td>
    {% assign previous_name = ''  %}
    {% for arch in sortedArchs %}
      <td>
      {% assign name = arch | split:"_"  %}
      {% if previous_name != name[0] %}
        {{  name[0] }}
      {% endif %}
      {% assign previous_name = name[0]  %}
      </td>
    {% endfor %}
  </tr>
  <tr>
   <td>
   </td>
   {% assign previous_name = ''  %}
   {% assign previous_os = ''  %}
   {% for arch in sortedArchs %}
      <td>
      {% assign name = arch | split:"_"  %}
      {% if previous_name != name[1] or previous_os != name[0]%}
        {{  name[1] }}
      {% endif %}
      {% assign previous_name = name[1]  %}
      {% assign previous_os = name[0]  %}
      </td>
   {% endfor %}
  </tr>
  <tr>
   <td>
   </td>
   {% for arch in sortedArchs %}
   <td>
    {% assign name = arch | split:"_"  %}
      {{  name[2] }}
   </td>
   {% endfor %}
  </tr>

  {% for releaseQueue in sortedReleaseQueues reversed %} 
    {% if releaseQueue[0] != 'all_archs' %}
    <tr>
      <td>
        {{ releaseQueue[0] }}
      </td>
      {% for arch in sortedArchs %}
        <td >
         {% if releaseQueue[1] contains arch %}
            {% assign ib_name_parts = releaseQueue[1][arch]['latest_IB']  | split:"_201"  %}
            {% if releaseQueue[1][arch]['status'] == 'ok' %}
              {% assign text_color = 'green'  %}
            {% elsif releaseQueue[1][arch]['status'] == 'unknown' %}
              {% assign text_color = 'gray'  %}
            {% elsif releaseQueue[1][arch]['status'] == 'warning' %}
              {% assign text_color = 'GoldenRod'  %}
            {% else %}
              {% assign text_color = 'red'  %}
            {% endif %}  
              <small>
                <a style="color:{{ text_color }}" href="http://cms-sw.github.io/showIB.html#{{ releaseQueue[1][arch]['latest_IB'] }}" > 201{{ ib_name_parts[1] }} </a>                
              </small>
         {% endif %}
        </td>
      {% endfor %}
    </tr>
    {% endif %}
  {% endfor %}


</table>



