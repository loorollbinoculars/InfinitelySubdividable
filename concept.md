## Concept for resizable, user-defined UI

You start with a large div. This div has a handle on the bottom right corner. By clicking and dragging on this handle, the following event is handled:

    (event)=>{
        distanceToHandle = event.dist
        if(distanceToHandle>15px){
            switch event.target{
                case boundary:
                    cancel()
                case self:
                    subdivide()
                case otherDiv:
                    primaryAxis = argmax(distanceVector)
                    if(checkNodeGraph(self, otherDiv)){
                        mergeDivs(self, otherDiv)
                    }
                } 
            }       
    }

The handle should be a div with a triangular clip-path (CSS).

In a reactive framework:

1. Clicking on a handle will trigger a handleDragEvent belonging to that handle's parent div.
2. When the handle is Over another element, compute 