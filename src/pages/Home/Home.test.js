import { render } from "@testing-library/react";
import Home from "./index"

describe("Testing Home", ()=> {
    it("Renderiza correctamente", ()=>{
        const {getByText} = render(<Home/>);
        const textElement = getByText("CRUD Productos")
        expect(textElement).toBeInTheDocument()
    })
})