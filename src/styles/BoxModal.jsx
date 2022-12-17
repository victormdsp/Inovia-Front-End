const BoxStyle = {
    width: '50vw',
    borderRadius: '10px',
    backgroundColor: '#EBDECA',
    padding: '1em',
    boxShadow: '0px 4px 20px rgb(0 0 0 / 30%)',
    '& > .mainDiv': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        '& > .produto': {
            boxShadow: '0px 4px 20px rgb(0 0 0 / 30%)',
            backgroundColor: '#9C9E70',
            width: '25vw',
            margin: '1em',
            borderRadius: '10px',
            padding: '0em 1em'
        }

    },
    '.mainForm': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    '.closeButton': {
        position: 'fixed',
    }
}

export default BoxStyle;