---
title: CMS Offline Software
layout: default
related:
 - { name: "Project page", link: "https://github.com/cms-sw/cmssw" }
 - { name: "Feedback", link: "https://github.com/cms-sw/cmssw/issues/new" }
---


## L1 Conveners

<ul>
{% for person in site.data.categories.L1 %}
  <li>
    <a href="https://github.com/{{ person }}">
            {{ person }}
    </a>
  </li>
{% endfor %}
</ul>

## L2 Conveners

<ul>
{% for category in site.data.categories.categories_to_people %}
  <li>
    <b> {{ category[0] | capitalize }} </b>
    <ul>
      {% for person in category[1] %}
        <li>
          <a href="https://github.com/{{ person }}">
            {{ person }}
          </a>
        </li>
      {% endfor %}
    </ul>
  </li>
{% endfor %}
</ul>


## Package Categories

<ul>
{% for category in site.data.categories.categories_to_packages %}
  <li>
    <b> {{ category[0] | capitalize }} </b>
    <ul>
      {% for package in category[1] %}
        <li>
          {{ package }}
        </li>
      {% endfor %}
    </ul>
  </li>
{% endfor %}
</ul>

