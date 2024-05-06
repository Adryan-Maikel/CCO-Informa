from flask import Flask, render_template, request
from gsheets import INFORMATIONS as INFO

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html")


@app.route("/sheets/<sheet>")
def open(sheet: str) -> str:
    if sheet not in INFO.keys():
        return render_template("error.html")
    ROWS = list(enumerate(INFO[sheet]["get"](), 2))
    COLS = [sheet.title()]
    if sheet == "operadores":
        ROWS = [[_i, *data] for _i, data in enumerate(INFO[sheet]["get"](), 2)]
        COLS = ["Operadores", "Cracha"]

    _sheet = render_template("table.html", table=sheet,
                             rows=ROWS, cols=COLS)

    return render_template("edit.html", table=_sheet)


@app.route("/edit/<sheet>", methods=["POST"])
def edit(sheet):
    if sheet not in INFO.keys():
        return render_template("error.html")
    if sheet == "operadores":
        row = request.form.get("row")
        operator = request.form.get("operadores")
        cracha = request.form.get("cracha")
        INFO[sheet]["upd"](row, operator, cracha)
        return open(sheet)

    row = request.form.get("row")
    value = request.form.get(sheet)
    INFO[sheet]["upd"](row, value)
    return open(sheet)


@app.route("/del/<sheet>", methods=["POST"])
def dell(sheet):
    if sheet not in INFO.keys():
        return render_template("error.html")
    row = request.form.get("row")
    if not row.isnumeric():
        return render_template("error.html")
    INFO[sheet]["del"](int(row))
    return open(sheet)


if __name__ == "__main__":
    app.run(debug=True)
