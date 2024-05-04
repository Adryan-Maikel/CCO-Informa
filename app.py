from flask import Flask, render_template
from gsheets import INFORMATIONS as INFO

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html")


@app.route("/edit/<table>")
def edit_table(table: str) -> str:
    ROWS = list(enumerate(INFO[table]["get"]()))
    COLS = [table.title()]
    if table == "operadores":
        ROWS = [[_id, *data] for _id, data in enumerate(INFO[table]["get"]())]
        COLS = ["Operadores", "Cracha"]

    _table = render_template("table.html", table=table,
                             rows=ROWS, cols=COLS)

    return render_template("edit.html", table=_table)


if __name__ == "__main__":
    app.run(debug=True)
