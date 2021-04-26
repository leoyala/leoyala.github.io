---
layout: post
classes: wide
title: "Dynamic plotting in Python (Plotly, Bokeh, mpld3 & HoloViews)"
author: Leonardo Ayala
date: 2021-04-26 08:00:00 -0000
categories: plot dynamic
tags: plotly bokeh dynamic python
permalink: dynamic-plotting-python
comments: true
plotly_image: posts/dynamic_plotting/2_parallelCat.html
---

Data visualization is becoming one of the most important tools when analyzing large datasets. A simplistic rendering of
a PNG image is no longer enough. Imagine you want to plot a line plot that contains 10000 lines, you wait for 10 minutes
for the result, and you realize that the ranges are not the best choice, or you would like to have some 
transparency in the lines, or it would be better to hide some traces, etc. etc. All of this usually involves re-plotting 
the entire dataset. As you might have already experienced, this process becomes tedious and time-consuming. Here is where 
dynamic plotting comes into place, when you create a dynamic plot you are able to modify the range of each axis after 
plotting, you can hide specific components in order to highlight part of your plot, you are even able to look at 
the values of each data-point. 

Some topics covered in this post are:
1. How to create dynamic plots
2. Which frameworks are available to create dynamic plots in python?
3. A comparison between frameworks available in Python
4. Advantages and disadvantages for each framework
5. Performance when plotting large amounts of data

## Dynamic plotting tools in python

There are several tools used for dynamic plotting in python, we will cover some of the most popular ones: [Plotly](https://plotly.com/), 
[Bokeh](https://docs.bokeh.org), [mpld3](https://mpld3.github.io) and [Holoviews](https://holoviews.org/). 

### Plotly 
Plotly is a very versatile tool that allows dynamic plotting of several types of data types directly in python. The plots
generated with Plotly can be easily share with others either as PNG images or as dynamic HTML files. There is one extra 
library that has gained a lot of popularity lately: `plotly-express`. One of the main reasons why `plotly-express` has 
gained popularity is that it has a very similar syntax to `seaborn`. `plotly-express` works very well with `pandas` data
frames, which makes it very easy to use. The most popular types of plots have already been integrated in `plotly-express`
but there is still space to grow. Let's take a look at some examples of the types of plots that can be generated with 
`plotly-express`.

```python
import plotly_express as px

df = px.data.gapminder()
figure = px.scatter(data_frame=df, x="lifeExp", y="gdpPercap", color="continent", animation_frame="year", size="pop")
figure.write_html("lifeExp.html", include_plotlyjs='cdn')
```
There are several subtle things happening here, and we will get through them now. First, notice how easy it is to 
specify the categorical types with `plotly-express`, similar to `seaborn`. Notice also that we included the parameter
`animation_frame` which means that animation controllers will be included in the plot and that each frame will be defined
by all the different values found in column `year` of the data frame. Another parameter that can come in handy is `include_plotlyjs`
which indicates if the `plotly.js` library is included/loaded in the output div string, setting it to `cdn` indicates that 
the library will not be stored in the HTML file, but you will need internet connection to be able to visualize the plot. 
This option becomes very handy when sharing files online. If it is set to `True`, then the library will be embedded in 
the HTML file, so you can use it with or without internet connection, but the file size will be at least ~3MB, no matter 
how much data you are plotting. 

{% include posts/dynamic_plotting/1_lifeExp.html %}

Scatter plots are one of the most used types of plots, but `plotly-express` ships with the possibility for more complex
types of plots. Like parallel coordinate plots, the following example was taken from [ParallelCategorical](https://plotly.com/python/parallel-categories-diagram/).
Notice that we can move each category to improve visualization, or highlight them by hovering over them. There is a lot
more that can be done with plotly, for more examples you can take a look at [PlotlyExpress](https://plotly.com/python/plotly-express/).
```python
import plotly.express as px

df = px.data.tips()
fig = px.parallel_categories(df, dimensions=['sex', 'smoker', 'day'],
                color="size", color_continuous_scale=px.colors.sequential.Inferno,
                labels={'sex':'Payer sex', 'smoker':'Smokers at the table', 'day':'Day of week'})

```
{% include posts/dynamic_plotting/2_parallelCat.html %}

Plotly is not limited to `plotly-express`, you can extend the types of plots by using directly `plotly.graph_objs` at the
cost of the amount of code hat you will have to write. For example bellow there is Heatmap linked to some buttons that modify
the appearance of the plot. Notice that the amount of code necessary for this has increased considerably, but you end up with a
really neat plot to play around. This example was taken from [PlotlyExpress](https://plotly.com/python/custom-buttons/).

>Another interesting tool that has been developed by Plotly is [Dash](https://plotly.com/dash/), which is a tool that allows
dynamic analysis of big amounts of data with a user-defined style that can be build rather quickly. One interesting fact
is that Plotly Dash sits on top of Nvidia RAPIDS cuda accelerated dataframes, which gives it a huge performance boost when 
analysing big amounts of data, you can read more about it here [RAPIDS](https://rapids.ai/plotly.html).

```python
import plotly.graph_objects as go

import pandas as pd

# load dataset
df = pd.read_csv("https://raw.githubusercontent.com/plotly/datasets/master/volcano.csv")

# Create figure
fig = go.Figure()

# Add surface trace
fig.add_trace(go.Heatmap(z=df.values.tolist(), colorscale="Viridis"))

# Update plot sizing
fig.update_layout(
    width=800,
    height=900,
    autosize=False,
    margin=dict(t=100, b=0, l=0, r=0),
)

# Update 3D scene options
fig.update_scenes(
    aspectratio=dict(x=1, y=1, z=0.7),
    aspectmode="manual"
)

# Add drowdowns
# button_layer_1_height = 1.08
button_layer_1_height = 1.12
button_layer_2_height = 1.065

fig.update_layout(
    updatemenus=[
        dict(
            buttons=list([
                dict(
                    args=["colorscale", "Viridis"],
                    label="Viridis",
                    method="restyle"
                ),
                dict(
                    args=["colorscale", "Cividis"],
                    label="Cividis",
                    method="restyle"
                ),
                dict(
                    args=["colorscale", "Blues"],
                    label="Blues",
                    method="restyle"
                ),
                dict(
                    args=["colorscale", "Greens"],
                    label="Greens",
                    method="restyle"
                ),
            ]),
            type = "buttons",
            direction="right",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=0.1,
            xanchor="left",
            y=button_layer_1_height,
            yanchor="top"
        ),
        dict(
            buttons=list([
                dict(
                    args=["reversescale", False],
                    label="False",
                    method="restyle"
                ),
                dict(
                    args=["reversescale", True],
                    label="True",
                    method="restyle"
                )
            ]),
            type = "buttons",
            direction="right",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=0.13,
            xanchor="left",
            y=button_layer_2_height,
            yanchor="top"
        ),
        dict(
            buttons=list([
                dict(
                    args=[{"contours.showlines": False, "type": "contour"}],
                    label="Hide lines",
                    method="restyle"
                ),
                dict(
                    args=[{"contours.showlines": True, "type": "contour"}],
                    label="Show lines",
                    method="restyle"
                ),
            ]),
            type = "buttons",
            direction="right",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=0.5,
            xanchor="left",
            y=button_layer_2_height,
            yanchor="top"
        ),
    ]
)

fig.update_layout(
    annotations=[
        dict(text="colorscale", x=0, xref="paper", y=1.1, yref="paper",
                             align="left", showarrow=False),
        dict(text="Reverse<br>Colorscale", x=0, xref="paper", y=1.06,
                             yref="paper", showarrow=False),
        dict(text="Lines", x=0.47, xref="paper", y=1.045, yref="paper",
                             showarrow=False)
    ])
```

{% include posts/dynamic_plotting/3_linkedPlotly.html %}

<br>

### Bokeh

[Bokeh](https://docs.bokeh.org/) is another tools available in Python that allows to generate plots similarly to 
Plotly. Probably one of the advantages of Bokeh over Plotly is the possibility to create linked plots rather easily with
the use of `ColumnDataSource` (CDS). This example was taken from [LinkedData](https://docs.bokeh.org/en/latest/docs/user_guide/data.html#userguide-data-linked-selection).
Notice that hovering on one subplot highlights the corresponding point on the other subplot, the same behaviour occurs when
selection points on each subplot. This adds an advantage of Bokeh over Plotly that many finds very attractive. 


```python
from bokeh.layouts import gridplot
from bokeh.models import BooleanFilter, CDSView, ColumnDataSource
from bokeh.plotting import figure, output_file, show

output_file("linked_selection_subsets.html")

x = list(range(-20, 21))
y0 = [abs(xx) for xx in x]
y1 = [xx**2 for xx in x]

# create a column data source for the plots to share
source = ColumnDataSource(data=dict(x=x, y0=y0, y1=y1))

# create a view of the source for one plot to use
view = CDSView(source=source, filters=[BooleanFilter([True if y > 250 or y < 100 else False for y in y1])])

TOOLS = "box_select,lasso_select,hover,help"

# create a new plot and add a renderer
left = figure(tools=TOOLS, plot_width=300, plot_height=300, title=None)
left.circle('x', 'y0', size=10, hover_color="firebrick", source=source)

# create another new plot, add a renderer that uses the view of the data source
right = figure(tools=TOOLS, plot_width=300, plot_height=300, title=None)
right.circle('x', 'y1', size=10, hover_color="firebrick", source=source, view=view)

p = gridplot([[left, right]])
show(p)
```
{% include posts/dynamic_plotting/4_linkedBokeh.html %}

Another exciting possibility with bokeh is that you can customize your tooltip to display almost anything. As an exmaple 
let's take a look at how to display custom images on hover. You will notice when running the code yourself that bokeh does
not include the `JS` library by default, it is linked as `cdn`. 

```python
from bokeh.plotting import ColumnDataSource, figure, output_file, show

output_file("toolbar.html")

source = ColumnDataSource(data=dict(
    x=[1, 2, 3, 4, 5],
    y=[2, 5, 8, 2, 7],
    desc=['A', 'b', 'C', 'd', 'E'],
    imgs=[
        'https://docs.bokeh.org/static/snake.jpg',
        'https://docs.bokeh.org/static/snake2.png',
        'https://docs.bokeh.org/static/snake3D.png',
        'https://docs.bokeh.org/static/snake4_TheRevenge.png',
        'https://docs.bokeh.org/static/snakebite.jpg'
    ],
    fonts=[
        '<i>italics</i>',
        '<pre>pre</pre>',
        '<b>bold</b>',
        '<small>small</small>',
        '<del>del</del>'
    ]
))

TOOLTIPS = """
    <div>
        <div>
            <img
                src="@imgs" height="42" alt="@imgs" width="42"
                style="float: left; margin: 0px 15px 15px 0px;"
                border="2"
            ></img>
        </div>
        <div>
            <span style="font-size: 17px; font-weight: bold;">@desc</span>
            <span style="font-size: 15px; color: #966;">[$index]</span>
        </div>
        <div>
            <span>@fonts{safe}</span>
        </div>
        <div>
            <span style="font-size: 15px;">Location</span>
            <span style="font-size: 10px; color: #696;">($x, $y)</span>
        </div>
    </div>
"""

p = figure(plot_width=400, plot_height=400, tooltips=TOOLTIPS,
           title="Mouse over the dots")

p.circle('x', 'y', size=20, source=source)
show(p)
```
{% include posts/dynamic_plotting/5_tooltipBokeh.html %}

To finalize this section, I would like to mention that **Bokeh** has a similar functionality as Plotly in order to create
interactive web apps to analyze data, you can take a look at [Bokeh server](https://docs.bokeh.org/en/latest/docs/user_guide/server.html) for more details.
You will notice that the complexity and amount of work required to develop an app in such service is considerably higher
than [Dash](https://plotly.com/dash/), I have been working with Dash for some time now, and I think it is one of the 
most simple structures that I have used so far, making it possible to develop an application faster.

<br>
### mpld3

[mpld3](https://mpld3.github.io/examples/index.html) is a library that brings together matplotlib and [D3js](https://d3js.org/).
The later one is a JavaScript library for creating interactive data visualization in the internet. In order to use this tool
we only need to install it with pip `pip install mpld3` and then we are ready to plot interactively. Let's take a look at
a very simple example taken from [LinkedBrush](https://mpld3.github.io/examples/linked_brush.html). 
```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

import mpld3
from mpld3 import plugins, utils


data = load_iris()
X = data.data
y = data.target

# dither the data for clearer plotting
X += 0.1 * np.random.random(X.shape)

fig, ax = plt.subplots(4, 4, sharex="col", sharey="row", figsize=(8, 8))
fig.subplots_adjust(left=0.05, right=0.95, bottom=0.05, top=0.95,
                    hspace=0.1, wspace=0.1)

for i in range(4):
    for j in range(4):
        points = ax[3 - i, j].scatter(X[:, j], X[:, i],
                                      c=y, s=40, alpha=0.6)

# remove tick labels
for axi in ax.flat:
    for axis in [axi.xaxis, axi.yaxis]:
        axis.set_major_formatter(plt.NullFormatter())

# Here we connect the linked brush plugin
plugins.connect(fig, plugins.LinkedBrush(points))

mpld3.show()
```

{% include posts/dynamic_plotting/6_linkedMpld3.html %}

There is a lot of customization that can be built on top of **D3js**. However, this comes at the cost of the amount of code
that we would have to write. Most importantly, if we want to include custom _tool-tip_ functionalities, we will have to
write the code ourselves in JavaScript. Let take a look at an example from [CustomToolTip](https://mpld3.github.io/examples/custom_plugin.html)

As you can see, we are able to plot more complex types of data representations at the cost of having to implement the code 
in JavaScript. For a more complete set of examples, take a look at [Mpld3SSamples](https://mpld3.github.io/examples/index.html#example-gallery).

```python
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import mpld3
from mpld3 import plugins, utils


class LinkedView(plugins.PluginBase):
    """A simple plugin showing how multiple axes can be linked"""

    JAVASCRIPT = """
    mpld3.register_plugin("linkedview", LinkedViewPlugin);
    LinkedViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    LinkedViewPlugin.prototype.constructor = LinkedViewPlugin;
    LinkedViewPlugin.prototype.requiredProps = ["idpts", "idline", "data"];
    LinkedViewPlugin.prototype.defaultProps = {}
    function LinkedViewPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    LinkedViewPlugin.prototype.draw = function(){
      var pts = mpld3.get_element(this.props.idpts);
      var line = mpld3.get_element(this.props.idline);
      var data = this.props.data;

      function mouseover(d, i){
        line.data = data[i];
        line.elements().transition()
            .attr("d", line.datafunc(line.data))
            .style("stroke", this.style.fill);
      }
      pts.elements().on("mouseover", mouseover);
    };
    """

    def __init__(self, points, line, linedata):
        if isinstance(points, matplotlib.lines.Line2D):
            suffix = "pts"
        else:
            suffix = None

        self.dict_ = {"type": "linkedview",
                      "idpts": utils.get_id(points, suffix),
                      "idline": utils.get_id(line),
                      "data": linedata}

fig, ax = plt.subplots(2)

# scatter periods and amplitudes
np.random.seed(0)
P = 0.2 + np.random.random(size=20)
A = np.random.random(size=20)
x = np.linspace(0, 10, 100)
data = np.array([[x, Ai * np.sin(x / Pi)]
                 for (Ai, Pi) in zip(A, P)])
points = ax[1].scatter(P, A, c=P + A,
                       s=200, alpha=0.5)
ax[1].set_xlabel('Period')
ax[1].set_ylabel('Amplitude')

# create the line object
lines = ax[0].plot(x, 0 * x, '-w', lw=3, alpha=0.5)
ax[0].set_ylim(-1, 1)

ax[0].set_title("Hover over points to see lines")

# transpose line data and add plugin
linedata = data.transpose(0, 2, 1).tolist()
plugins.connect(fig, LinkedView(points, lines[0], linedata))

mpld3.show()
```
{% include posts/dynamic_plotting/7_customTooltipMpld3.html %}

<br>

### HoloViews
[HoloViews](https://holoviews.org/) is a tool that builds on top of `Bokeh`. In my opinion it is to Bokeh what `plotly-express`
is to `Plotly`. To install it simple do this: `pip install holoviews`. Let's take a look at a simple scatter example taken
from [ScatterExample](https://holoviews.org/getting_started/Introduction.html).

```python
import holoviews as hv
import seaborn as sns
hv.extension('bokeh')
station_info = sns.load_dataset("fmri")
scatter = hv.Scatter(station_info, 'timepoint', 'signal')
scatter
```

{% include posts/dynamic_plotting/8_scatterHoloviews.html %}

More involved plots can also be generated, such as the cord plot example below taken from [CordPlot](https://holoviews.org/gallery/demos/bokeh/route_chord.html#demos-bokeh-gallery-route-chord)
Remember that to run the example below yourself, you will need to download first the sample data from Bokeh, you can do this 
by running `bokeh.sampledata.download()`. For a more complete list of examples take a look at [SamplesHoloviews](https://holoviews.org/gallery/index.html).

```python
import holoviews as hv
from holoviews import opts, dim
from bokeh.sampledata.airport_routes import routes, airports

hv.extension('bokeh')
# Count the routes between Airports
route_counts = routes.groupby(['SourceID', 'DestinationID']).Stops.count().reset_index()
nodes = hv.Dataset(airports, 'AirportID', 'City')
chord = hv.Chord((route_counts, nodes), ['SourceID', 'DestinationID'], ['Stops'])

# Select the 20 busiest airports
busiest = list(routes.groupby('SourceID').count().sort_values('Stops').iloc[-20:].index.values)
busiest_airports = chord.select(AirportID=busiest, selection_mode='nodes')
busiest_airports.opts(
    opts.Chord(cmap='Category20', edge_color=dim('SourceID').str(), 
               height=800, labels='City', node_color=dim('AirportID').str(), width=800))
```

{% include posts/dynamic_plotting/9_cordHoloviews.html %}

<br>

## Plotting speed 
We have been talking for some time now about the different types of plots that can be achieved with each tool. It is 
time now to take a look into their efficiency. We will be testing two approaches a) plotting speed of a small dataset 
(~100 points) and b) plotting speed of a big dataset (~100,000 data points). Lets first load the data that we will be 
using: 

```python
import pandas as pd
import numpy as np

import plotly_express as px
from bokeh.plotting import figure
import matplotlib.pyplot as plt, mpld3
import holoviews as hv

x_s = np.random.rand(10**2)
y_s = np.random.rand(10**2)
data = dict(x=x_s, y=y_s)
df_small = pd.DataFrame(data)

x_b = np.random.rand(10**6)
y_b = np.random.rand(10**6)
data = dict(x=x_b, y=y_b)
df_big = pd.DataFrame(data)

%timeit  -r 7 -n 10 px.scatter(data_frame=df_small, x="x", y="y")
%timeit  -r 7 -n 10 px.scatter(data_frame=df_big, x="x", y="y")

%timeit  -r 7 -n 10 p=figure(plot_width=400, plot_height=400); p.circle(x_s, y_s)
%timeit  -r 7 -n 10 p=figure(plot_width=400, plot_height=400); p.circle(x_b, y_b)

%timeit  -r 7 -n 10 fig=plt.scatter(x_s, y_s); mpld3.display()
%timeit  -r 7 -n 10 fig=plt.scatter(x_b, y_b); mpld3.display()

%timeit  -r 7 -n 10 fig = hv.Scatter((x_s, y_s)); hv.render(fig)
%timeit  -r 7 -n 10 fig = hv.Scatter((x_b, y_b)); hv.render(fig)

```

The specifications of the computer where this code runs are showed below
```commandline
                          ./+o+-       -
                  yyyyy- -yyyyyy+      OS: Ubuntu 20.04 focal
               ://+//////-yyyyyyo      Kernel: x86_64 Linux 5.4.0-72-generic
           .++ .:/++++++/-.+sss/`      -
         .:++o:  /++++++++/:--:/-      -
        o:+o+:++.`..```.-/oo+++++/     Shell: bash 5.0.17
       .:+o:+o/.          `+sssoo+/    Resolution: 1920x1080
  .++/+:+oo+o:`             /sssooo.   DE: GNOME 3.36.5
 /+++//+:`oo+o               /::--:.   -
 \+/+o+++`o++o               ++////.   -
  .++.o+++oo+:`             /dddhhh.   -
       .+.o+oo:.          `oddhhhh+    -
        \+.++o+o``-````.:ohdhhhhh+     -
         `:o+++ `ohhhhhhhhyo++os:      -
           .o:`.syhhhhhhh/.oo++o`      CPU: Intel Core i7-8750H @ 12x 4.1GHz [56.0°C]
               /osyyyyyyo++ooo+++/     GPU: NVIDIA GeForce GTX 1050 Ti with Max-Q Design
                   ````` +oo+++o\:     RAM: 15655MiB
                          `oo++.      

```

We will test the performance of plotting scatter visualizations of both datasets with each of the tools that have been 
presented until now. We will use the build-in functionality `%timeit` inside of IPhyton for this purpose. Below you can
see the results.

It is important to notice here that even though mppld3 takes a small time for plotting, the call of `mpld3.show()` takes 
a lot longer, making it even impossible to plot the big dataset. 

Another important finding here is that even though plotly takes longer to plot a  big dataset (still around milliseconds).
The dynamic interactions of the result are considerably more responsive that all the others, which is in the end what we
are looking for. This can be due to the fact that Plotly uses **NVIDIA RAPIDS** to accelerate the plot of big datasets. 
The take home message of this section is:
> If you are plotting small datasets you can use any of these tools, and you will see almost no difference in performance.
> If you want to plot big datasets, go with `plotly` whenever possible for more responsive plots.

```commandline
Plotly:
Small dataset: 27.1 ms ± 252 µs per loop (mean ± std. dev. of 7 runs, 10 loops each)
Big dataset: 1.74 s ± 71.9 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)


Bokeh (without tooltips):
Small dataset: 3.03 ms ± 34.3 µs per loop (mean ± std. dev. of 7 runs, 10 loops each)
Big dataset: 907 ms ± 34.7 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)

mpld3:
Samll dataset: 117 ms ± 1.35 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
Big dataset: ~ too long

Holoviews:
Samll dataset: 189 ms ± 2.57 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
Big dataset: 285 ms ± 18.1 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

## Learning curve
After trying for some days each of the tools that we have reviewed in this post, I would recommend to use **Plotly** if
you would like to learn to do dynamic plots fast. Specially, I would recommend using `plotly-express`. If you want to 
modify how the results look like after using `plotly-express`, you can still use the`Figure.update` method to modify either
the traces or the layout of the plot, You still have full control of the visualization after using `plotly-express`. 
IF you need to do computations at run time for a database, you can pair `plotly-express` with `Dash` and you will get a 
really great combination.

If you require very specific controls for your visualization then I would recommend using `Bokeh` or `mpld3` just be aware
that for those extra integrations, you will have to hardcode it in `HTML` or `JS`. 
So my general recommendation would be:

> Use `plotly-express` or `plotly-express` + `Dash` for a fast learning curve, and use `Bokeh` or `mpld3` for custom-made 
> visualizations that can not be done with `plotly-express`.

## Community support
To finalize this post I would like to write something about community support for these tools. If we talk only about the 
**GitHub** contributors for the specific visualization libraries that we have discussed, `Bokeh` is at the top at this 
moment. I am not active in their support community, so I am not sure how responsive the community is. However, from a 
first glance it looks like it is very active. 
My experience with the `Plotly` community has been good so far, and I will probably stick with it for the time being. 

Well, I hope that this has been of help to you somehow and until next time!
