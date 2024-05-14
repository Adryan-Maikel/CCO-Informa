from flask import Flask, render_template, request
from gsheets import INFORMATIONS as INFO

COLS_CCO_INFORMA = INFO["cco-informa"]["cols"]()
LETTERS = "A B C D E F G H I J K".split()

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html")


@app.route("/sheets/<sheet>")
def open(sheet: str) -> str:
    if sheet == "cco-informa":
        ROWS = [[_i, *data]
                for _i, data in enumerate(INFO[sheet]["get"](), 2)]
        return render_template("cco-informa.html", table=sheet, rows=ROWS,
                               cols=COLS_CCO_INFORMA, letters=LETTERS)
        # return render_template("edit.html", table=_sheet)
    if sheet not in INFO:
        ERRO = "Não deveria fazer isso."
        return render_template("error.html", erro=ERRO)
    ROWS = list(enumerate(INFO[sheet]["get"](), 2))
    COLS = [sheet.title()]
    if sheet == "operadores":
        ROWS = [[_i, *data]
                for _i, data in enumerate(INFO[sheet]["get"](), 2)]
        COLS = ["Operadores", "Cracha"]

    _sheet = render_template("table.html", table=sheet,
                             rows=ROWS, cols=COLS)

    return render_template("edit.html", table=_sheet)


@app.route("/edit/<sheet>", methods=["POST"])
def edit(sheet: str) -> str:
    if sheet not in INFO:
        ERRO = "Não deveria fazer isso."
        return render_template("error.html", erro=ERRO)

    if sheet == "cco-informa":
        row = request.form.get("row")
        values = {}
        for letter in LETTERS:
            values[letter] = request.form.get(letter)
        INFO[sheet]["upd"](int(row), values)
        ROWS = [[i, *data]for i, data in enumerate(INFO[sheet]["get"](), 2)]
        return render_template("cco-informa.html", table=sheet, rows=ROWS,
                               cols=COLS_CCO_INFORMA, letters=LETTERS)

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
def dell(sheet: str) -> str:
    if sheet not in INFO:
        return render_template("error.html")
    row = request.form.get("row")
    if not row.isnumeric():
        return render_template("error.html")
    INFO[sheet]["del"](int(row))
    return open(sheet)


@app.route("/add/<sheet>", methods=["post"])
def add(sheet: str) -> str:
    if sheet not in INFO:
        ERRO = "Não deveria fazer isso."
        return render_template("error.html", erro=ERRO)
    row = request.form.get("row")
    if not row.isnumeric():
        ERRO = f"Row {row} não é um número."
        return render_template("error.html", erro=ERRO)
    row = int(row)
    direction = request.form.get("direction")
    if sheet == "cco-informa":
        values = {}
        for letter in "A B C D E F G H I J K".split():
            input = request.form.get(letter)
            if input:
                values[letter] = input
        INFO[sheet]["add"](direction, row, values)
        ROWS = [[_i, *data]
                for _i, data in enumerate(INFO[sheet]["get"](), 2)]
        return render_template("cco-informa.html", table=sheet, rows=ROWS,
                               cols=COLS_CCO_INFORMA, letters=LETTERS)
    if sheet == "operadores":
        operator = request.form.get("operadores")
        cracha = request.form.get("cracha")
        INFO[sheet]["add"](direction, row, operator, cracha)
        return open(sheet)

    value = request.form.get(sheet)
    INFO[sheet]["add"](direction, row, value)
    return open(sheet)


if __name__ == "__main__":
    app.run(debug=True)
