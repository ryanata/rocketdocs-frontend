import useOnClickListener from './useOnClickListener';
import useToolbarIconsList from './useToolbarIconsList';
import { Button } from "@/components/ui/button"

const Toolbar = () => {
  const { onClick } = useOnClickListener();
  const { icons } = useToolbarIconsList();

  return (
    // <Grid container sx={{ background: 'white', p: 1 }}>
    <div className="flex bg-white p-1">
      {icons.map(i => (
        <div className="mr-2" key={i.id}>
          <Button
            onClick={() => onClick(i.event)}
            variant="toolicon" 
            size="icon"
            className={i.active ? "bg-blue-500 hover:none" : "bg-white hover:none"}
          >
            {i.Icon}
          </Button>
        </div>
      ))}
    </div>
    // </Grid>
  );
};

export default Toolbar;