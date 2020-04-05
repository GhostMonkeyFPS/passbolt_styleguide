<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Passbolt - MFA onboarding report</title>
    <!--
             ____                  __          ____
            / __ \____  _____ ____/ /_  ____  / / /_
           / /_/ / __ `/ ___/ ___/ __ \/ __ \/ / __/
          / ____/ /_/ (__  |__  ) /_/ / /_/ / / /_
         /_/    \__,_/____/____/_.___/\____/_/\__/

        The open source password manager for team
         (c) 2020 Passbolt SA

    -->
    <base href="../../">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="src/img/webroot/favicon.ico" />
    <link rel="icon" href="src/img/webroot/favicon_32.png" sizes="32x32" />
    <link rel="icon" href="src/img/webroot/favicon_57.png" sizes="57x57" />
    <link rel="icon" href="src/img/webroot/favicon_76.png" sizes="76x76" />
    <link rel="icon" href="src/img/webroot/favicon_96.png" sizes="96x96" />
    <link rel="icon" href="src/img/webroot/favicon_128.png" sizes="128x128" />
    <link rel="icon" href="src/img/webroot/favicon_192.png" sizes="192x192" />
    <link rel="icon" href="src/img/webroot/favicon_228.png" sizes="228x228" />
    <link rel="stylesheet" type="text/css" href="src/css/themes/default/api_main.css">
    <script src="src/js/apexcharts.min.js"></script>
</head>
<body class="report report-html">
<div id="container" class="report report-html">
    <div class="grid">
        <div class="row report-header">
            <div class="col6 creator-info">
                <h1>Passbolt report</h1>
                <ul>
                    <li>
                        <span class="label">Report name:</span>
                        <span class="value">MFA Onboarding</span>
                    </li>
                    <li>
                        <span class="label">Generated by:</span>
                        <span class="value">Ada Lovelace</span>
                    </li>
                    <li>
                        <span class="label">Creation date:</span>
                        <span class="value">30th of March 2020</span>
                    </li>
                </ul>
            </div>
            <div class="col6 company-info last">
                <div class="logo">
                    <img src="../../../src/img/logo/logo.png"/>
                </div>
            </div>
        </div>
        <div class="report-content">
            <div class="row description">
                <div class="col12">
                    <p><strong>Description:</strong> This report lorem ipsum lorem ipsum lorem ipsum</p>
                </div>
            </div>
            <div class="row charts">
                <div class="col4">
                    <div class="chart">
                        <div id="chart1" class="canvas"></div>
                        <p>Of the users<br>have MFA configured</p>
                    </div>
                    <script>
                      var options = {
                        chart: {
                          height: 200,
                          type: 'radialBar',
                        },
                        series: [45],
                        labels: ['total'],

                        plotOptions: {
                          radialBar: {
                            hollow: {
                              margin: 15,
                              size: "70%"
                            },

                            dataLabels: {
                              showOn: "always",
                              name: {
                                show: false,
                              },
                              value: {
                                offsetY: 7,
                                color: "#111",
                                fontSize: "25px",
                                show: true,
                              }
                            }
                          }
                        },
                        fill: {
                          type: "solid",
                          colors: ['#009900']
                        },
                        stroke: {
                          lineCap: "round",
                        },
                      }

                      var chart = new ApexCharts(document.querySelector("#chart1"), options);
                      chart.render();
                    </script>
                </div>
                <div class="col4">
                    <div class="chart">
                        <div id="chart2" class="canvas"></div>
                        <p>Of the admins<br>have MFA configured</p>
                    </div>
                    <script>
                      var options = {
                        chart: {
                          height: 200,
                          type: 'radialBar',
                        },
                        series: [70],
                        labels: ['total'],

                        plotOptions: {
                          radialBar: {
                            hollow: {
                              margin: 15,
                              size: "70%"
                            },

                            dataLabels: {
                              showOn: "always",
                              name: {
                                show: false,
                              },
                              value: {
                                offsetY: 7,
                                color: "#111",
                                fontSize: "25px",
                                show: true
                              }
                            }
                          }
                        },
                        fill: {
                          type: "solid",
                          colors: ['#009900']
                        },
                        stroke: {
                          lineCap: "round",
                        },
                      }

                      var chart = new ApexCharts(document.querySelector("#chart2"), options);
                      chart.render();
                    </script>
                </div>
                <div class="col4 last">
                    <div class="chart">
                        <div id="chart3" class="canvas"></div>
                        <p>Users<br>need to configure MFA</p>
                    </div>
                    <script>
                      var options = {
                        chart: {
                          height: 200,
                          type: 'radialBar',
                        },
                        series: [5],
                        labels: ['total'],

                        plotOptions: {
                          radialBar: {
                            hollow: {
                              margin: 15,
                              size: "70%",
                            },

                            dataLabels: {
                              showOn: "always",
                              name: {
                                show: false,
                              },
                              value: {
                                offsetY: 7,
                                color: "#000",
                                fontSize: "25px",
                                show: true,
                                formatter: function (val) {
                                  return val;
                                }
                              }
                            }
                          }
                        },
                        fill: {
                          type: "solid",
                          colors: ['#92000C']
                        },
                        stroke: {
                          lineCap: "round",
                        },
                      }

                      var chart = new ApexCharts(document.querySelector("#chart3"), options);
                      chart.render();
                    </script>
                </div>
            </div>
            <div class="row list">
                <div class="col12">
                    <table class="table-info horizontal ">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Active since</th>
                            <th>MFA?</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Ada Lovelace</td>
                            <td>ada@passbolt.com</td>
                            <td>4 days ago</td>
                            <td>No</td>
                            <td>User</td>
                        </tr>
                        <tr>
                            <td>Betty Holberton</td>
                            <td>betty@passbolt.com</td>
                            <td>10 days ago</td>
                            <td>No</td>
                            <td>Admin</td>
                        </tr>
                        <tr>
                            <td>Betty Holberton</td>
                            <td>betty@passbolt.com</td>
                            <td>10 days ago</td>
                            <td>No</td>
                            <td>Admin</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>