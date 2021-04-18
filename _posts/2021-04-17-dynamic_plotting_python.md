---
layout: post
classes: wide
title: "Dynamic plotting in Python (plotly, bokeh, etc.)"
author: Leonardo Ayala
date: 2021-04-17 08:00:00 -0000
categories: plot dynamic
tags: plotly bokeh dynamic python
permalink: dynamic-plotting-python
comments: true
plotly_image: posts/dynamic_plotting/2_parallelCat.html
---

To-REVIEW: 
1. https://docs.bokeh.org/en/latest/docs/user_guide/data.html#userguide-data-linked-selection
2. https://mpld3.github.io/examples/index.html
3. https://holoviews.org/

HIGHLIGHT:
1. plotly has cuda rapids in the core with opengl plotting options
2. plotly has plotly express which is similar to seaborn interface
3. Bokeh has shared data among plots which allows for interlinked interactions between plots
4. Holoviews is built on top of bokeh 
5. mpld3 is like interactive matplotlib
6. plotly has dash!

TO-TEST:
1. plotting speed of small datasets
2. plotting speeds of big datasets
3. comparison of linked interactions among plots
4. learning curve for each platform
5. community support / contributors

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
2. Which tool are available for dynamic plots in python
3. A comparison between those tool
4. Advantages and disadvantages 
5. Plotting large amounts of data

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
