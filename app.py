from flask import Flask, render_template
from gsheets import INFORMATIONS as INFO

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html")


@app.route("/sheets/<sheet>")
def open(sheet: str) -> str:
    if sheet not in INFO.keys():
        return render_template("error.html")
    ROWS = list(enumerate(INFO[sheet]["get"](), 1))
    COLS = [sheet.title()]
    if sheet == "operadores":
        ROWS = [[_id, *data] for _id, data in enumerate(INFO[sheet]["get"](), 1)]
        COLS = ["Operadores", "Cracha"]

    _sheet = render_template("table.html", table=sheet,
                             rows=ROWS, cols=COLS)

    return render_template("edit.html", table=_sheet)


@app.route("/edit/<sheet>")
def edit(sheet):
    if sheet not in INFO.keys():
        return render_template("error.html")
    


if __name__ == "__main__":
    app.run(debug=True)
